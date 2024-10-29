import styles from "./style";
function SignUpForm({ toggleForm }) {
    return (
        <div>
            <form style={styles.form}>
                <h2 style={styles.title}>Sign up</h2>
                <div style={styles.inputField} className="input-field">
                    <i className="fa-solid fa-user" style={styles.icon}></i>
                    <input type="text" placeholder="Username" style={styles.input} />
                </div>
                <div style={styles.inputField}>
                    <i style={styles.icon} className="fa-solid fa-envelope"></i>
                    <input type="email" placeholder="Email" style={styles.input} />
                </div>
                <div style={styles.inputField}>
                    <i style={styles.icon} className="fa-solid fa-lock"></i>
                    <input type="password" placeholder="Password" style={styles.input} />
                </div>
                <input type="submit" style={styles.btn} className="btn" value="Sign up" />
                <p style={styles.socialText}>Or Sign up with social platforms</p>
                <div style={styles.socialMedia} className="social-media">
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-brands fa-facebook"></i></a>
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-solid fa-envelope"></i></a>
                    <a href="#" style={styles.socialIcon} className="social-icon"><i className="fa-solid fa-link"></i></a>
                </div>
                <div className='d-flex align-items-center'>
                    <p className='m-0'>
                    Already have an account?
                    </p>
                    <button
                        className='btn text-primary'
                        onClick={toggleForm}
                    >
                       Login
                    </button>
                </div>            </form>
        </div>
    );
}

export default SignUpForm;