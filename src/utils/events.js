export const getAllEvents = async () => {
    return [
        {
            id: 1,
            title: "Memorial Day Party",
            start_date: new Date(), 
            end_date: new Date(),
            ongoing: true
        },
        {
            id: 2,
            title: "Science Fair",
            /* Set start_date to tomorrow and end_date to the day after tomorrow */
            start_date: new Date(new Date().setDate(new Date().getDate() + 1)), 
            end_date: new Date(new Date().setDate(new Date().getDate() + 3)),
            ongoing: false
        },
        {
            id: 3,
            title: "Art Exhibition",
            start_date: new Date(), 
            end_date: new Date(),
            ongoing: true
        }
    ];
}