import styles from './style'
function LoginForm({ toggleForm }) {
    return (
        <div>
            <form style={styles.form}>
                <h2 style={styles.title}>Login</h2>
                <div style={styles.inputField}>
                    <i className="fa-solid fa-user" style={styles.icon}></i>
                    <input type="text" placeholder="Username" style={styles.input} />
                </div>
                <div style={styles.inputField} className="input-field">
                    <i className="fa-solid fa-lock" style={styles.icon}></i>
                    <input type="password" placeholder="Password" style={styles.input} />
                </div>
                <input type="submit" value="Login" style={styles.btn} />
                <p style={styles.socialText} className="social-text">Or Sign in with social platforms</p>
                <div style={styles.socialMedia} className="social-media">
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-brands fa-facebook"></i></a>
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-solid fa-envelope"></i></a>
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-solid fa-link"></i></a>
                </div>
                <div className='d-flex align-items-center'>
                    <p className='m-0'>
                        Don't have an account?
                    </p>
                    <button
                        className='btn text-primary'
                        onClick={toggleForm}
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;