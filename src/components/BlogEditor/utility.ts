export const getNodeFromKey = (key: string) => {
    return document.querySelectorAll(
        `[data-offset-key="${key}-0-0"]`
    )[0];
}