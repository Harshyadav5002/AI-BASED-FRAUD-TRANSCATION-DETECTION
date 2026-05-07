import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Settings, Moon, Sun, FileText, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ theme, toggleTheme }) => {
  return (
    <motion.aside 
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar glass-panel"
    >
      <div className="sidebar-logo">
        <ShieldAlert size={32} />
        <span>Fraud Transaction Detection</span>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '32px', flex: 1 }}>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/alerts" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <ShieldAlert size={20} /> Fraud Alerts
        </NavLink>
        <NavLink to="/transactions" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FileText size={20} /> Browse TXN
        </NavLink>
        <NavLink to="/test-scan" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <PlusCircle size={20} /> Run Manual Scan
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button 
          onClick={toggleTheme} 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
