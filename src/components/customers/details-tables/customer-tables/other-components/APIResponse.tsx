// Define a type that allows any data structure for apiResponse
export type APIResponseType = Record<string, unknown>;

interface APIResponseProps {
  apiResponse: APIResponseType;
}

const APIResponse: React.FC<APIResponseProps> = ({ apiResponse }) => {
  return (
    <div className="p-4 border border-gray-50 rounded bg-[#f9f9f9] text-xs font-mono whitespace-pre-wrap">
      {JSON.stringify(apiResponse, null, 2)}
    </div>
  );
};

export default APIResponse;
