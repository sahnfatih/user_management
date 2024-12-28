import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import styles from './Layout.module.css';
import 'react-toastify/dist/ReactToastify.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <motion.h1 
            className={styles.logo}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            User Management System
          </motion.h1>
        </div>
      </nav>
      
      <main className={styles.mainContent}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      
      <ToastContainer 
        position="bottom-right"
        theme="colored"
        autoClose={3000}
      />
    </div>
  );
};