import { Link } from "react-router-dom";

const NotFoud = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h3 className="text-5xl font-bold">404</h3>
          <h3 className="text-3xl font-bold mt-2">Look like you're lost</h3>
          <p className="py-6">The page you are looking for not avaible!</p>
          <Link to={"/"}>
            <button className="btn btn-primary">Go to back</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoud;
