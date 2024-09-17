import browser from 'webextension-polyfill';

async function canBlockDownload() {
    const result = await browser.storage.local.get('blockDownloads');
    return !!result.blockDownloads;
}

browser.downloads.onCreated.addListener(async (downloadItem: any) => {
    if (await canBlockDownload()) {
        console.log("Blocked download")
        await browser.downloads.cancel(downloadItem.id);
        await browser.notifications.create({
        type: "basic",
        iconUrl: "icon48.png",
        title: "Download Blocked",
        message: `The download was blocked.`
        });
    }
});