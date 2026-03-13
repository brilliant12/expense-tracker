import Navbar from "./NavBar";

function Home() {
    return (
        <>
            <Navbar />

            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h1 className="text-success fw-bold">Hi 👋 Welcome to MyApp</h1>
                        <p className="text-muted mt-3">
                            
                        </p>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-md-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Fast</h5>
                                <p className="card-text">
                                    Built with React and Laravel for speed.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Secure</h5>
                                <p className="card-text">
                                    Token-based authentication system.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Scalable</h5>
                                <p className="card-text">
                                    Supports Admin & User roles easily.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
