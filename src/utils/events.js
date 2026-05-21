import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';


export const getAllEvents = async () => {
    /* Fetches all documents from 'events' collection in Firestore */
    const eventsCollection = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);

    const eventsList = eventsSnapshot.docs.map(doc => {
        const data = doc.data();

        /* Convert Firestore timestamps to JavaScript Date objects with chaining operator (?) */
        const jsStartDate = data.start_date?.toDate();
        const jsEndDate = data.end_date?.toDate();

        return {
            id: doc.id,
            title: data.title,
            start_date: jsStartDate,
            end_date: jsEndDate,
            ongoing: new Date() < jsEndDate
        };
    });
    return eventsList;
}