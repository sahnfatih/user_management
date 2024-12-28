import { useState, useEffect } from 'react';
import { 
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { User } from '../types';
import styles from './UserForm.module.css';

interface Props {
  user?: User | null;
  mode: 'create' | 'edit' | 'delete';
  onSubmit: (user: User) => void;
  onBack: () => void;
  loading?: boolean;
}

export const UserForm = ({ user, mode, onSubmit, onBack, loading }: Props) => {
  const [formData, setFormData] = useState<User>({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const isReadOnly = mode === 'delete';

  const buttonConfig = {
    create: { text: 'Create Member', icon: <SaveIcon />, className: styles.primaryButton },
    edit: { text: 'Save Changes', icon: <SaveIcon />, className: styles.primaryButton },
    delete: { text: 'Confirm Delete', icon: <DeleteIcon />, className: styles.deleteButton }
  }[mode];

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <PersonIcon sx={{ fontSize: 32 }} />
          </div>
          <div>
            <h2 className={styles.title}>
              {mode === 'create' ? 'Add New Member' : 
               mode === 'edit' ? 'Edit Member Details' : 
               'Remove Member'}
            </h2>
            <p className={styles.subtitle}>
              {mode === 'create' ? 'Add a new member to your team' :
               mode === 'edit' ? 'Update the member information' :
               'Are you sure you want to remove this member?'}
            </p>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.field}>
              <label className={styles.label}>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                disabled={isReadOnly || loading}
                className={styles.input}
                placeholder="Enter first name"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                disabled={isReadOnly || loading}
                className={styles.input}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              disabled={isReadOnly || loading}
              className={styles.input}
              placeholder="Enter email address"
            />
          </div>

          <div className={styles.actions}>
            <button
              onClick={onBack}
              className={styles.secondaryButton}
              disabled={loading}
            >
              <ArrowBackIcon />
              Back
            </button>
            <button
              onClick={() => onSubmit(formData)}
              className={buttonConfig.className}
              disabled={loading}
            >
              {buttonConfig.icon}
              {buttonConfig.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};