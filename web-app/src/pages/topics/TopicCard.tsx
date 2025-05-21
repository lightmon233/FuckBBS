import { Link } from 'react-router-dom';
import { formatDate, timeDifferenceLessThanHourFromPresent } from '~/util/dateHelpers';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useAuthContext } from '~/contexts/AuthContextProvider';

type TopicCardProps = {
  topicId: number;
  createdTime: Date;
  creator: string;
  header: string;
  message: string;
  userId?: number;
  sendDeleteTopicRequest?: (topicId: number) => void;
  handleEditTopic?: (topicId: number) => void;
};

const dateFormatForum = 'MM.DD.YYYY H:mm:ss';
const deleteIconColor = '#ffffff';
const editIconColorEnabled = '#ffffff';
const editIconColorDisabled = '#747679';
const iconSize = 30;
const alignmentBaseline = 'baseline';

const TopicCard = ({
  createdTime,
  creator,
  header,
  message,
  topicId,
  userId,
  sendDeleteTopicRequest,
  handleEditTopic
}: TopicCardProps) => {
  const {
    authState: { userId: loggedInUserId, role }
  } = useAuthContext();

  const isUserAllowedInteractWithTopic =
    role === 'ADMIN' || userId === loggedInUserId;

  const showEnabledOrDisabledIcon = () => {
    if (role === 'ADMIN') {
      return true;
    }

    return timeDifferenceLessThanHourFromPresent(createdTime);
  };

  return (
    <div className="max-w-screen-xl p-3 overflow-hidden text-white border-black rounded-xl bg-pink-100 hover:bg-pink-200">
      <div className="flex justify-between">
        <Link to={topicId.toString()} className="flex-grow">
          <p className="text-2xl text-gray-900">{header}</p>
          <p className="text-slate-500">{formatDate(createdTime, dateFormatForum)}</p>
          <p className="text-cyan-600">{creator}</p>
          <p className="text-slate-500">{message}</p>
        </Link>
        {isUserAllowedInteractWithTopic && (
          <div id="button-container" className="flex gap-2 self-start">
            {handleEditTopic && (
              <span className="flex self-center gap-2 px-2 py-1 rounded-xl bg-pink-300">
                <MdModeEdit
                  size={iconSize}
                  alignmentBaseline={alignmentBaseline}
                  cursor={showEnabledOrDisabledIcon() ? 'pointer' : 'cursor'}
                  color={
                    showEnabledOrDisabledIcon()
                      ? editIconColorEnabled
                      : editIconColorDisabled
                  }
                  onClick={
                    showEnabledOrDisabledIcon()
                      ? (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditTopic(topicId);
                        }
                      : void 0
                  }
                />
              </span>
            )}
            {sendDeleteTopicRequest && (
              <span className="flex self-center gap-2 px-2 py-1 rounded-xl bg-red-500">
                <MdDelete
                  size={iconSize}
                  alignmentBaseline={alignmentBaseline}
                  cursor="pointer"
                  color={deleteIconColor}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    sendDeleteTopicRequest(topicId);
                  }}
                />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCard;