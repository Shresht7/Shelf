<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let items = $state<any[]>(data.saves);
    let url = $state("");

    $inspect(items);

    async function saveUrl(e: SubmitEvent) {
        e.preventDefault();
        const response = await fetch("/api/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
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
