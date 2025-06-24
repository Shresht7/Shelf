<script lang="ts">
    let items = $state<string[]>([]);
    let url = $state("");

    function saveUrl(e: SubmitEvent) {
        e.preventDefault();
        items.push(url);
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
        <p>{item}</p>
    {/each}
</main>
