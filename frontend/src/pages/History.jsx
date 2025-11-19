import { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { taskAPI } from '../utils/api';

const History = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletedTasks();
  }, []);

  const loadCompletedTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      const done = response.data.data.filter(t => t.status === 'DONE');
      setCompletedTasks(done);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">History</h1>
          <p className="text-slate-400">Your completed tasks with evidence</p>
        </div>

        {/* Grid of Completed Tasks */}
        {completedTasks.length === 0 ? (
          <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center">
            <ImageIcon size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">No completed tasks yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Complete tasks and upload evidence to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-700 transition-colors"
              >
                {/* Evidence Image */}
                {task.evidenceImage && (
                  <div className="aspect-video bg-slate-800 overflow-hidden">
                    <img
                      src={task.evidenceImage}
                      alt={task.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Task Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <Calendar size={14} />
                    <span>{formatDate(task.completedAt)}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {task.completedSessions} session{task.completedSessions !== 1 ? 's' : ''}
                    </span>
                    <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded">
                      Validated
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
