<script lang="ts">
    let items = $state<any[]>([]);
    let url = $state("");

    async function getItems() {
        const response = await fetch("/api/items", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return;
        }

        items = await response.json();
    }

    $inspect(items);

    $effect(() => {
        getItems();
    });

    async function saveUrl(e: SubmitEvent) {
        e.preventDefault();
        const response = await fetch("/api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url,
                title: "Example title",
                type: "article",
                content: "Optional Content",
                tags: "example, test",
            }),
        });
        console.log(await response.json());
    }
</script>

<form onsubmit={saveUrl}>
    <input
        id="url"
        type="text"
        placeholder="Save a URL. https://..."
        bind:value={url}
    />
    <button type="submit">Save</button>
</form>

<main>
    {#each items as item}
        <p>{item.url}</p>
    {/each}
</main>
