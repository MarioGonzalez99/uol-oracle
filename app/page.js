import Link from "next/link";

const HomePage = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold text-primary">Welcome to UoL Oracle</h1>
          <p className="py-5 text-lg leading-loose">
            Your one-stop knowledge hub for all things UoL
          </p>
          <Link href={"/chat"} className="btn btn-secondary">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
