import { useEffect, useState } from 'react';

// firebase imports
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

//configs
import { db } from 'utils/configs/firebaseConfig';

/**
 *  Search one document from firestore
 */
export const useDocument = (c, _query, _orderBy) => {
  const [document, setDocument] = useState(null);
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
        if (results.length) {
          setDocument(results[0]);
        } else {
          setDocument(null);
        }
        setCurrentState('loaded');
      },
      (error) => {
        setCurrentState('error');
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [c, q, oBy]);

  return { document, currentState };
};

/**
 *  Search documents from firestore
 */

export const useCollection = (c, _query, _orderBy) => {
  const [documents, setDocuments] = useState([]);
  const [currentState, setCurrentState] = useState('loading');

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

/**
 *  Search documents from firestore with sub collection
 */
export const useCollectionWithSub = ({ _collection, id, subCollection, _query, _orderBy }) => {
  const [documents, setDocuments] = useState([]);
  const [currentState, setCurrentState] = useState('loading');

  const q = JSON.stringify(_query);
  const oBy = JSON.stringify(_orderBy);

  useEffect(() => {
    let ref = collection(db, _collection, id, subCollection);

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
  }, [_collection, id, subCollection, q, oBy]);

  return { documents, currentState };
};
