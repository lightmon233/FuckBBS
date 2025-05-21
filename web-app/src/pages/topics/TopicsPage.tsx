import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavbarLayout from '~/components/navbar/NavbarLayout';
import TopicCard from './TopicCard';
import { BoardTopicsDto, TopicDto } from '~/data/apiTypes';
import env from '~/util/env';
import { useFetch } from '~/hooks/useFetch';
import NewPostForm from '../../components/NewPostForm';
import { useAuthContext } from '~/contexts/AuthContextProvider';
import { toast as sendToast } from 'react-toastify';
import EditTopicModal from '../../components/EditTopicModal';

type DeleteResponse = { message: string; topicId: number };

const TopicsPage = () => {
  const [message, setMessage] = useState('');
  const [heading, setHeading] = useState('');
  const [topics, setTopics] = useState<TopicDto[]>([]);
  // State for edit functionality
  const [editMsg, setEditMsg] = useState('');
  const [editHeader, setEditHeader] = useState('');
  const [clickedEditedTopic, setClickedEditedTopic] = useState<number | null>(null);
  const [sendPutRequest, setSendPutRequest] = useState(false);
  // State for delete functionality
  const [clickedDeleteTopic, setClickedDeleteTopic] = useState<number | null>(null);

  const { name: boardName } = useParams();
  const navigate = useNavigate();

  const { authState } = useAuthContext();
  const { isLogged, userId: loggedInUserId, role } = authState;

  // Fetch board topics
  const {
    data: response,
    sendRequest,
    loading
  } = useFetch<BoardTopicsDto>(`${env.API_URL}/board?name=${boardName}`);

  // Create new topic
  const fetchConfig = {
    method: 'POST',
    payload: {
      message,
      heading,
      boardName
    }
  } as const;

  const { data: topicResponse, sendRequest: postTopic } = useFetch<TopicDto>(
    `${env.API_URL}/topics/topic`,
    fetchConfig
  );

  // Delete topic
  const { data: deleteResponse, sendRequest: deleteTopicRequest } =
    useFetch<DeleteResponse>(`${env.API_URL}/topics/${clickedDeleteTopic}`, {
      method: 'DELETE'
    });

  // Edit topic
  const getPutPayload = (): TopicDto | undefined => {
    const oldTopic = topics.find((t) => t.id === clickedEditedTopic);
    if (!oldTopic) return undefined;

    return { ...oldTopic, message: editMsg, header: editHeader };
  };

  const {
    data: putResponse,
    sendRequest: putTopicRequest,
    nullApiResponse: nullPutTopicResponse
  } = useFetch<TopicDto>(`${env.API_URL}/topics/${clickedEditedTopic}`, {
    method: 'PUT',
    payload: getPutPayload()
  });

  // Force api call when route changes
  useEffect(() => {
    sendRequest();
  }, [boardName, sendRequest]);

  // Open new created topic
  useEffect(() => {
    if (topicResponse) {
      navigate(`${topicResponse.id}`);
    }
  }, [topicResponse, navigate]);

  // Update topics from board response
  useEffect(() => {
    if (response?.topics) {
      setTopics(response.topics);
    }
  }, [response]);

  // Handle topic deletion
  useEffect(() => {
    if (clickedDeleteTopic === null) {
      return;
    }

    deleteTopicRequest();
    setClickedDeleteTopic(null);
  }, [clickedDeleteTopic, deleteTopicRequest]);

  // Update topics after deletion
  useEffect(() => {
    if (!deleteResponse) {
      return;
    }

    const { topicId: deletedTopicId } = deleteResponse;

    const updateTopicsAfterDelete = (prevTopics: TopicDto[]) =>
      prevTopics.filter((topic) => topic.id !== deletedTopicId);

    setTopics(updateTopicsAfterDelete);
    setClickedDeleteTopic(null);
    sendToast.success('Successfully deleted topic');
  }, [deleteResponse]);

  // Handle topic editing request
  useEffect(() => {
    if (clickedEditedTopic === null || !sendPutRequest) {
      return;
    }

    putTopicRequest();
  }, [clickedEditedTopic, putTopicRequest, sendPutRequest]);

  // Update topics after editing
  useEffect(() => {
    if (!putResponse) {
      return;
    }

    const updateModifiedTopic = (prevTopics: TopicDto[]) =>
      prevTopics.map((oldTopic) =>
        putResponse.id === oldTopic.id ? putResponse : oldTopic
      );

    setTopics(updateModifiedTopic);
    setSendPutRequest(false);
    sendToast.success('Successfully updated topic');
    setEditMsg('');
    setEditHeader('');
    setClickedEditedTopic(null);
    nullPutTopicResponse();
  }, [putResponse, nullPutTopicResponse]);

  const sendTopicClicked = (e: React.MouseEvent) => {
    e.preventDefault();
    postTopic();
  };

  const sendDeleteTopicRequest = (topicId: number) => {
    if (topicId === null) return;
    setClickedDeleteTopic(topicId);
  };

  const handleEditTopic = (topicId: number) => {
    const topicToEdit = topics.find((t) => t.id === topicId);
    if (!topicToEdit) return;

    setEditMsg(topicToEdit.message);
    setEditHeader(topicToEdit.header);
    setClickedEditedTopic(topicId);
  };

  const sendEditedTopicRequest = (e: React.MouseEvent) => {
    e.preventDefault();
    setSendPutRequest(true);
  };

  // Check if user can edit/delete a topic
  const canUserInteractWithTopic = (topicUserId: number | undefined) => {
    if (role === 'ADMIN') return true;
    return topicUserId === loggedInUserId;
  };

  if (loading) {
    return null;
  }

  if (!response?.topics.length) {
    return (
      <NavbarLayout>
        <div className="flex flex-col justify-center flex-grow">
          <h1 className="self-center mb-10 text-2xl text-cyan-400">
            No topics yet...
          </h1>
          {isLogged && (
            <NewPostForm
              msg={message}
              setMsg={setMessage}
              heading={heading}
              setHeading={setHeading}
              sendClicked={sendTopicClicked}
            />
          )}
        </div>
      </NavbarLayout>
    );
  }

  return (
    <NavbarLayout>
      <div className="flex justify-center flex-grow">
        <div className="flex flex-col flex-grow max-w-screen-xl text-left w-100 text-slate-900">
          <header>
            <h1 className="font-sans text-3xl font-bold text-cyan-600">
              {response?.name}
            </h1>
            <p className="font-serif text-xl text-cyan-400">
              {response?.adjective}
            </p>
          </header>
          <div id="topic-content" className="flex flex-col gap-5 mt-5">
            {topics.map(
              ({ createdTime, creator, header, id, message, userId }) => (
                <TopicCard
                  key={id}
                  topicId={id}
                  createdTime={createdTime}
                  creator={creator}
                  header={header}
                  message={message}
                  userId={userId}
                  sendDeleteTopicRequest={isLogged && canUserInteractWithTopic(userId) ? sendDeleteTopicRequest : undefined}
                  handleEditTopic={isLogged && canUserInteractWithTopic(userId) ? handleEditTopic : undefined}
                />
              )
            )}
          </div>
          {isLogged && (
            <NewPostForm
              msg={message}
              setMsg={setMessage}
              heading={heading}
              setHeading={setHeading}
              sendClicked={sendTopicClicked}
            />
          )}
        </div>
      </div>
      {clickedEditedTopic !== null && (
        <EditTopicModal
          message={editMsg}
          setMessage={setEditMsg}
          header={editHeader}
          setHeader={setEditHeader}
          sendEditedTopic={sendEditedTopicRequest}
        />
      )}
    </NavbarLayout>
  );
};

export default TopicsPage;