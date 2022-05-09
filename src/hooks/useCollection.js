import { useEffect, useState } from 'react';

// firebase imports
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

//configs
import { db } from 'utils/configs/firebaseConfig';

export const useCollection = (c, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [currentState, setCurrentState] = useState('loading');

  // solution to infinity loop problem in useEffect with the possibility of listening for changes -> https://github.com/facebook/react/issues/14476
  const q = JSON.stringify(_query);
  const oBy = JSON.stringify(_orderBy);

  useEffect(() => {
    let ref = collection(db, c);

    if (q) {
      ref = query(ref, where(...JSON.parse(q)));
    }
    if (oBy) {
      ref = query(ref, orderBy(...JSON.parse(oBy)));
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setCurrentState('loaded');
      },
      (error) => {
        setCurrentState('error');
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [c, q, oBy]);

  return { documents, currentState };
};
