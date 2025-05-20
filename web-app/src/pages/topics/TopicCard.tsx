import { Link } from 'react-router-dom';
import { formatDate } from '~/util/dateHelpers';

type TopicCardProps = {
  topicId: number;
  createdTime: Date;
  creator: string;
  header: string;
  message: string;
};

const dateFormatForum = 'DD.MM.YYYY H:mm:ss';

const TopicCard = ({
  createdTime,
  creator,
  header,
  message,
  topicId
}: TopicCardProps) => (
  <div className="max-w-screen-xl p-3 overflow-hidden text-white border-black rounded-xl bg-pink-100 hover:cursor-pointer hover:bg-pink-200">
    <Link to={topicId.toString()}>
      <p className="text-2xl text-slate-900">{header}</p>
      <p className="text-slate-500">
        {formatDate(createdTime, dateFormatForum)}
      </p>
      <p className="text-slate-500">{creator}</p>
      <p className="text-slate-400">{message}</p>
    </Link>
  </div>
);

export default TopicCard;
