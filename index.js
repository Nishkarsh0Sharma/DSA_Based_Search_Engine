import express, { raw } from "express";
import fs from "fs/promises";
import pkg from "natural";

import preprocess from './utils/preprocess.js';
import { platform } from "os";

const { TfIdf } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("."));

let problem = [];
let tfidf = new TfIdf();


// store each document's vector and its magnitude
let docVectors = [];
let docMagnitudes = [];

async function loadProblemsAndBuildIndex(){
    const data = await fs.readFile("./corpus/all_problems.json", "utf-8");
    problem = JSON.parse(data);

    tfidf = new TfIdf();

    // add documents : title boosted by duplicating. plus description
    problem.forEach((problem,idx)=>{
        const text = preprocess(
            `${problem.title} ${problem.title} ${problem.description || ""}`
        );
        tfidf.addDocument(text, idx.toString());
    });


    // build document vectors and magnitudes for cosine similarity
    docVectors = [];
    docMagnitudes = [];
    problem.forEach((_, idx)=>{
        const vector = {};
        let sumSquares = 0;

        tfidf.listTerms(idx).forEach( ({ term , tfidf : weight }) => {
            vector[term] = weight;
            sumSquares += weight * weight;
        } );

        docVectors[idx] = vector;
        docMagnitudes[idx] = Math.sqrt(sumSquares);
    });

}

app.post("/search", async (req, res)=>{
    const rawQuery = req.body.query;

    if( !rawQuery || typeof rawQuery !== "string" ){
        return res.status(400).json({ error: "Missing or invalid query" });
    }

    // preprocess query and tokenize
    const query = preprocess(rawQuery);
    const tokens = query.split(" ").filter(Boolean);

    // build the query TFxIDF vector
    const termFreq = {};
    tokens.forEach((t)=>{
        termFreq[t] = (termFreq[t] || 0) + 1;
    });

    const queryVector = {};
    let sumSqQ = 0;
    const N = tokens.length;
    Object.entries(termFreq).forEach( ([term , count]) => {
        const tf = count / N;
        const idf = tfidf.idf(term);
        const w = tf * idf;
        queryVector[term] = w;
        sumSqQ += w * w;
    });

    const queryMag = Math.sqrt(sumSqQ);

    // compute consine similarity against each document
    const scores = problem.map( (_, idx)=>{
        const docVec = docVectors[idx];
        const docMag = docMagnitudes[idx] || 1;
        let dot = 0;

        for(const [term,wq] of Object.entries(queryVector)){
            if( docVec[term] ){
                dot += wq * docVec[term];
            }
        }

        const cosine = dot / (queryMag * docMag);
        return { idx , score : cosine };
    });

    // take top 10 non-zero scores
    const top = scores
        .filter((s)=> s.score > 0)
        .sort((a,b)=> b.score - a.score)
        .slice(0,10)
        .map(({idx})=>{
            const p = problem[idx];
            let platform = "Unknown";
            if (p.url.includes("leetcode.com")) {
                platform = "LeetCode";
            } else if (p.url.includes("codeforces.com")) {
                platform = "CodeForces";
            } else if (p.url.includes("codechef.com")) {
                platform = "CodeChef";
            } else if (p.url.includes("atcoder.jp")) {
                platform = "AtCoder";
            }
            return { ...p , platform };
        });

    res.json({ results : top });
});

loadProblemsAndBuildIndex().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
});