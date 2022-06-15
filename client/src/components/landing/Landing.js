import React from "react";
import { connect } from "react-redux";
import anya from "./../../img/03.png"
import { setCurrentUser } from "../../actions/authActions";

import "./Landing.css";

class Landing extends React.Component {
  async componentDidMount() {
    await this.props.setCurrentUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Nhận ngay giftcode giới hạn</h1>
                <p className="lead">
                  Nhận ngay trang phục SSS, SS hữu hạn, quân huy, thẻ giảm giá 799 quân huy...
                </p>
                <hr />
                {isAuthenticated ? (
                  <div>
                    <br />
                    <h2 className="display-5 mb-4">Chúc mừng bạn {user.name} đã bị lừa</h2>
                    <img src={anya} style={{width: 120}}></img>
                  </div>
                ) : (
                  <div>
                    <div className="google-btn-container">
                      <a href="/auth/google">
                        <div className="google-btn">
                          <div className="google-icon-wrapper">
                            <img
                              className="google-icon"
                              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                              alt="signin"
                            />
                          </div>
                          <p className="btn-text">
                            <b>Log in with Google</b>
                          </p>
                        </div>
                      </a>
                    </div>
                    <p></p>
                    <div className="google-btn-container">
                      <div className="google-btn">
                        <a href="" target="_blank">
                          <p className="btn-text">
                            <b>Log in with Garena</b>
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { setCurrentUser }
)(Landing);
