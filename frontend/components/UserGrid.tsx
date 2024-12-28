import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { 
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { User } from '../types';
import styles from './UserGrid.module.css';

interface Props {
  users: User[];
  onNew: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export const UserGrid = ({ users, onNew, onEdit, onDelete, onRefresh, loading }: Props) => {
  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      renderCell: () => (
        <Avatar sx={{ bgcolor: '#4f46e5' }}>
          <PersonIcon />
        </Avatar>
      ),
      sortable: false
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 130
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 130
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.5,
      minWidth: 200
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className={styles.actions}>
          <Tooltip title="Edit">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(params.row as User);
              }}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(params.row as User);
              }}
              size="small"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Team Members</h2>
            <p className={styles.subtitle}>
              Manage your team members and their account permissions here.
            </p>
          </div>
          <div className={styles.buttonGroup}>
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className={styles.secondaryButton}
                disabled={loading}
              >
                <RefreshIcon />
                Refresh
              </button>
            )}
            <button
              onClick={onNew}
              className={styles.primaryButton}
              disabled={loading}
            >
              <PersonAddIcon />
              Add Member
            </button>
          </div>
        </div>
      </div>

      <div className={styles.gridContainer}>
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id || Math.random()}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </div>
    </div>
  );
};