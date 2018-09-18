await Promise.all(nutritionData.map(item => firebase.firestore().collection('Näringsinnehåll').doc(item.Livsmedelsnamn).set(item)))

db = firebase.firestore(); nutritionData.forEach(item => db.collection('Näringsinnehåll').doc(item.Livsmedelsnamn.replace(/\//g, '')).set(item))

firebase.firestore().collection('data').doc('naringsinnehall').get().then(doc => console.log(doc.data()))

(await firebase.firestore().collection('Näringsinnehåll').get()).docs