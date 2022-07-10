import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { toDoState } from "./atom";
import styled from "styled-components";
import Board from "./Components/Board";

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 11px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, settoDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      settoDos((allBorard) => {
        const boardCopy = [...allBorard[source.droppableId]];
        //Board를 복사한다.
        const taskObj = boardCopy[source.index];
        console.log(taskObj);
        boardCopy.splice(source.index, 1);
        //복사한 Board를 대체 변형한다. 여기서는 source 인덱스를 지우고 있다.
        boardCopy.splice(destination?.index, 0, taskObj);
        //지운 source 인덱스를 원하는 destination 인덱스에 taskObj로 추가하고 있다.
        return {
          ...allBorard,
          [source.droppableId]: boardCopy,
          //다른 Board들을 모두 반환한다.
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      settoDos((allboard) => {
        const sourceBoard = [...allboard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destiantionBoard = [...allboard[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destiantionBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allboard,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destiantionBoard,
        };
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
