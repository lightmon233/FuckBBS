import React, { Dispatch, SetStateAction } from 'react';

type EditTopicModalProps = {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  header: string;
  setHeader: Dispatch<SetStateAction<string>>;
  sendEditedTopic: (e: React.MouseEvent) => void;
};

const EditTopicModal = ({
  message,
  setMessage,
  header,
  setHeader,
  sendEditedTopic
}: EditTopicModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-gray-300 rounded-t">
            <h3 className="text-xl font-semibold text-gray-700">Edit Topic</h3>
          </div>
          <div className="relative flex-auto p-6">
            <form>
              <div className="mb-4">
                <label
                  htmlFor="topicHeader"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Header
                </label>
                <input
                  type="text"
                  id="topicHeader"
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="topicMessage"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="topicMessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                  rows={5}
                />
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={sendEditedTopic}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTopicModal;