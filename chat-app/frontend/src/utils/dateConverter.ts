export  function convertDateToHM(date: string): string {
    try {
        const d = new Date(date)
        const hours = d.getHours();
        const minutes = d.getMinutes() > 10 ? d.getMinutes() : `0${d.getMinutes()}`;
        return `${hours}:${minutes}`;
    } catch (error) {
        return "Invalid date"
    }
}
