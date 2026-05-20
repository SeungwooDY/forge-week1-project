export const getAllEvents = async () => {
    return [
        {
            id: 1,
            title: "Math Final",
            start_date: new Date(), 
            end_date: new Date()
        },
        {
            id: 2,
            title: "Science Fair",
            start_date: new Date(new Date().setDate(new Date().getDate() + 1)), 
            end_date: new Date(new Date().setDate(new Date().getDate() + 2))
        }
    ];
}