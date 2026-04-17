import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

function TaskColumn({ title, tasks, columnId }) {
  return (
    <div style={styles.column}>
      <h3>{title}</h3>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={styles.taskList}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

const styles = {
  column: {
    width: "30%",
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "8px",
  },
  taskList: {
    minHeight: "100px",
  },
};

export default TaskColumn;
