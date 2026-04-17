import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Clock, Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const isCompleted = task.status === 'completed';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border transition-colors ${
        isCompleted ? 'border-green-200 dark:border-green-900/30' : 'border-gray-200 dark:border-slate-700'
      }`}
    >
      <div className="flex gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-blue-500 text-gray-400 flex items-center h-full pt-1"
        >
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {task.title}
            </h3>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
            </div>
            <div className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md">
              {task.category}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-l border-gray-100 dark:border-slate-700 pl-4 justify-center">
          <button 
            onClick={() => onToggleStatus(task)}
            className={`p-1.5 rounded-lg transition-colors ${
              isCompleted 
                ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' 
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {isCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
          </button>
          
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Edit2 size={20} />
          </button>
          
          <button 
            onClick={() => onDelete(task._id)}
            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
