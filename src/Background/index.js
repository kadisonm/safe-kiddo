import browser from 'webextension-polyfill';

async function canBlockDownload() {
    const result = await browser.storage.local.get('blockDownloads');
    return result.blockDownloads || false;
}

browser.downloads.onCreated.addListener(async (downloadItem) => {
    if (await canBlockDownload()) {
        await browser.downloads.cancel(downloadItem.id);
        await browser.notifications.create({
        type: "basic",
        iconUrl: "icon-34.png",
        title: "Download Blocked",
        message: `The download was blocked.`
        });
    }
});