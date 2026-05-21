import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

 /* Fetches all documents from 'events' collection in Firestore */
export const getAllEvents = async () => {
    const eventsCollection = collection(db, 'Events');
    const eventsSnapshot = await getDocs(eventsCollection);

    const eventsList = eventsSnapshot.docs.map(doc => {
        const data = doc.data();

        /* Convert Firestore timestamps to JavaScript Date objects with chaining operator (?) */
        const jsStartDate = data.start_date?.toDate();
        const jsEndDate = data.end_date?.toDate();

        /* If the new Date is before the end date, then the event is automatically ongoing */
        return {
            id: doc.id,
            title: data.ename,
            start_date: jsStartDate,
            end_date: jsEndDate,
            ongoing: data.ongoing || (jsEndDate ? new Date() < jsEndDate : false)
        };
    });
    return eventsList;
}

/* Adds a new event document to the 'events' collection in Firestore */
export const addEvent = async (event) => {
    const eventsCollection = collection(db, 'Events');
    await addDoc(eventsCollection, event);
}