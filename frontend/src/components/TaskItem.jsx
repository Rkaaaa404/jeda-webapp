import { CheckCircle, Circle, Trash2, Edit2 } from 'lucide-react';

const TaskItem = ({ task, onSelect, onComplete, onDelete, onEdit, isSelected }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case 'DONE':
        return 'bg-emerald-900/30 border-emerald-700';
      case 'IN_PROGRESS':
        return 'bg-blue-900/30 border-blue-700';
      default:
        return 'bg-slate-800 border-slate-700';
    }
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'DONE':
        return <span className="text-xs px-2 py-1 rounded bg-emerald-900 text-emerald-300">Done</span>;
      case 'IN_PROGRESS':
        return <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-300">In Progress</span>;
      default:
        return <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300">To Do</span>;
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all cursor-pointer ${getStatusColor()} ${
        isSelected ? 'ring-2 ring-emerald-500' : ''
      }`}
      onClick={() => task.status !== 'DONE' && onSelect(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-white font-medium mb-1">{task.title}</h3>
          {getStatusBadge()}
        </div>
        <div className="flex gap-2 ml-2">
          {task.status === 'IN_PROGRESS' && task.completedSessions >= task.estimatedSessions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task);
              }}
              className="text-emerald-500 hover:text-emerald-400 transition-colors"
              title="Mark as Complete"
            >
              <CheckCircle size={20} />
            </button>
          )}
          {task.status === 'TODO' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className="text-blue-500 hover:text-blue-400 transition-colors"
                title="Edit Task"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                }}
                className="text-red-500 hover:text-red-400 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span>
            {task.completedSessions} / {task.estimatedSessions} sessions
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{
              width: `${Math.min((task.completedSessions / task.estimatedSessions) * 100, 100)}%`
            }}
          />
        </div>
      </div>

      {/* Evidence Indicator */}
      {task.status === 'DONE' && task.evidenceImage && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
          <CheckCircle size={14} />
          <span>Evidence Uploaded</span>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
