export  function convertDateToHM(date: string): string {
    try {
        const d = new Date(date)
        const hours = d.getHours();
        const minutes = d.getMinutes();
        return `${hours}:${minutes}`;
    } catch (error) {
        return "Invalid date"
    }
}
