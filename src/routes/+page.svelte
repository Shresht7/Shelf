<script lang="ts">
    import type { saves } from "$lib/server/database/schema/saves";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let items = $state<(typeof saves.$inferSelect)[]>(data.saves);
    let url = $state("");

    let disabled = $derived(!URL.canParse(url));

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
        const data = (await response.json()) as typeof saves.$inferSelect;
        items.push(data);
    }
</script>

<form onsubmit={saveUrl}>
    <input
        id="url"
        type="text"
        placeholder="Save a URL. https://..."
        bind:value={url}
    />
    <button type="submit" {disabled}>Save</button>
</form>

<main>
    {#each items as item}
        <p>{item.url}</p>
    {/each}
</main>

<style>
    main {
        margin-top: 1rem;
    }
</style>
