import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export async function getGradebook(classId) {
    const snapshot = await getDocs(
        collection(db, "Classes", classId, "Gradebook"),
    );
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export function categoryAverage(entries) {
    if (!entries || entries.length === 0) return null;
    const totalScore = entries.reduce((sum, e) => sum + e.score, 0);
    const totalMax = entries.reduce((sum, e) => sum + e.max, 0);
    if (totalMax === 0) return null;
    return (totalScore / totalMax) * 100;
}

export function overallGrade(grades, gradeDistribution) {
    if (!grades || !gradeDistribution) return null;

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [category, weight] of Object.entries(gradeDistribution)) {
        const avg = categoryAverage(grades[category]);
        if (avg != null) {
            weightedSum += avg * weight;
            totalWeight += weight;
        }
    }

    return totalWeight > 0 ? weightedSum / totalWeight : null;
}
