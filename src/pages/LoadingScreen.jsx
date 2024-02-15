import { useRecoilValue } from "recoil";
import loadingState from "../store/atoms/loading";

const LoadingScreen = () => {
  const isLoading = useRecoilValue(loadingState);

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="spinner border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      <p className="text-white text-lg mt-4">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
