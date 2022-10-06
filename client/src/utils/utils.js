export default function formatDate(timestamp) {
    const date = new Date(timestamp);
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${minutes}`;
}
