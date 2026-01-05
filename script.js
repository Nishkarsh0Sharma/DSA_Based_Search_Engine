const form = document.getElementById("search-form");
const input = document.getElementById("query-input");
const resultDiv = document.getElementById("results");
const spinner = document.getElementById("spinner");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    if(!query) return;

    resultDiv.innerHTML = "";
    spinner.classList.remove("hidden");

    try{
        const res = await fetch("/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        });

        if(!res.ok) throw new Error(`Server error: ${res.status}`);

        const { results } = await res.json();

        spinner.classList.add("hidden");

        if( results.length === 0 ){
            resultDiv.innerHTML = "<p>No results found.</p>";
            return;
        }

        resultDiv.innerHTML = results
            .map((r,i)=>{
                return `
                    <div class="card${i === 0 ? " featured" : ""}">
                        <div class="card-header">
                            <img src="assets/logos/${r.platform.toLowerCase()}.png"
                                alt="${r.platform} logo"
                                class="platform-logo"/>
                            <a href="${r.url}" target="_blank" class="card-title">
                            [${r.platform}] ${r.title}
                            </a>
                        </div>
                    </div>
                `;
            })
            .join("");
    } catch(err){
        spinner.classList.add("hidden");
        console.error(err);
        resultDiv.innerHTML = `<p>Error: ${err.message}</p>`;
    }
});