import { useState } from 'react';
import { useAuthContext } from 'hooks/auth/useAuthContext';

// styles
import styles from './UserProfile.module.scss';

//components
import ChangePassForm from 'components/ChangePassForm/ChangePassForm';

// firebase
import { storage } from '../utils/configs/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { useFirestore } from 'hooks/useFirestore';

const UserProfile = () => {
  const { user } = useAuthContext();
  const [isPendingAvatar, setIsPending] = useState(false);
  const { updateDocument } = useFirestore('users');

  const changeAvatar = async (thumbnail) => {
    setIsPending(true);
    try {
      // upload user thumbnail
      const uploadPath = `thumbnails/${user.uid}/avatar`;
      const imgRef = ref(storage, uploadPath);
      const snap = await uploadBytes(imgRef, thumbnail);
      const imgUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));

      // update profile
      await updateProfile(user, { photoURL: imgUrl });
      updateDocument(user.uid, { photoURL: imgUrl });

      setIsPending(false);
    } catch (err) {
      setIsPending(false);
    }
  };

  const handleFileChange = (e) => {
    let selected = e.target.files[0];

    if (!selected.type.includes('image')) return;

    if (selected.size > 1000000) return;

    changeAvatar(selected);
  };
  return (
    <section className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.avatar}>
          <img src={user.photoURL} alt="your avatar" />
        </div>
        <p>{user.displayName}</p>
      </div>
      <div className={styles.col}>
        <p>
          Display name: <span>{user.displayName}</span>
        </p>
      </div>
      <div className={styles.col}>
        <p>
          E-mail: <span>{user.email}</span>
        </p>
      </div>
      <details className={`${styles.details} ${styles.col}`}>
        <summary>Change password</summary>
        <ChangePassForm />
      </details>
      <div className={styles.col}>
        <p>
          Change avatar:{' '}
          <label className={styles.fileInput}>
            <input type="file" onChange={handleFileChange} disabled={isPendingAvatar} />
            {!isPendingAvatar ? 'Choose a file' : 'Loading...'}
          </label>
        </p>
      </div>
    </section>
  );
};

export default UserProfile;
