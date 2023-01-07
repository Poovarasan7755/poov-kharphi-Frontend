import React, { Component } from "react";
import { Container, Row, Col, Card, Form, Modal, Spinner } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import { Divider } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import Select from "react-select";
import { toast } from "react-toastify";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import Carousel from "react-elastic-carousel";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import Avatar from "react-avatar";

import moment from "moment-timezone";

// Styles
import "../../css/CourseDetail.scss";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";
import Label from "../../components/core/Label";
import { tableIcons } from "../core/TableIcons";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farfaHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasfaHeart, faWarning } from "@fortawesome/free-solid-svg-icons";

// Roles
import { ROLES_STUDENT } from "../../constants/roles";
import { customStyles } from "../core/Selector";

// Styles
const tableTheme = createTheme({
  overrides: {
    MuiTableRow: {
      root: {
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "rgba(224, 224, 224, 1) !important",
        },
        "&:nth-child(even)": {
          backgroundColor: "#f0f5f5",
        },
      },
    },
  },

  palette: {
    primary: {
      main: "#1d1464 !important",
    },
    secondary: {
      main: "#fff !important",
    },
  },
});

// Carousel
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3, itemsToScroll: 3 },
  { width: 1200, itemsToShow: 3, itemsToScroll: 3 },
  { width: 1440, itemsToShow: 5, itemsToScroll: 5 },
];

export default class CourseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      role: localStorage.getItem("role"),
      user: localStorage.getItem("userId"),
      aliasName: this.props?.match?.params?.id,
      courseData: "",
      lessonDetail: [],
      scheduleDetail: "",
      show: false,
      email: "",
      password: "",
      token: "",
      userId: "",
      isLoading: true,
      isSubmit: false,
      passwordShown: false,
      favourite: false,
      spinner: false,
      checkoutLesson: [],
      checkoutId: [],
      isLessonCheckOut: false,
      isSchedule: false,
      courseId: "",
      lessonPayment: "",
      lessonIds: [],
      lessonNumber: "",
      showMultiplePay: false,
      multiLessonData: [],
      lessonSchedule: "",
      lessonScheduleId: "",
      courseCheckout: "",
      studentList: "",
      date: new Date().toLocaleString(),
    };
  }

  togglePasswordVisibility = () => {
    this.setState({ passwordShown: !this.state.passwordShown });
  };

  handleModal() {
    this.setState({ show: false });
  }

  ModalClose = () => {
    this.setState({ isLessonCheckOut: false });
  };

  scheduleClose = () => {
    this.setState({ isSchedule: false });
  };

  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  // Log out
  logout = () => {
    setTimeout(() => {
      localStorage.clear(this.props.history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  // Success Handler
  responseGoogleSuccess = (response) => {
    Api.post("api/v1/user/login", {
      tokenId: response.tokenId,
      googleId: response.googleId,
      isGoogleLogin: true,
    })
      .then((res) => {
        const data = res.data.user;
        const token = data.token;
        const parentId = data.parentId ? data.parentId : null;
        const studentId = data.studentId ? data.studentId : null;
        const teacherId = data.teacherId ? data.teacherId : null;
        const role = data.role;
        const userId = data.id;
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("parentId", parentId);
        localStorage.setItem("studentId", studentId);
        localStorage.setItem("teacherId", teacherId);
        localStorage.setItem("sessionId", token);
        const isStudent = role === ROLES_STUDENT;
        if (!res.data.dataVerified) {
          isStudent &&
            this.props.history.push({
              pathname: `/edit/student/details/${studentId}`,
              state: {
                aliasName: this.state.aliasName,
              },
            });
        }
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      });
  };

  //FaceBook
  responseFacebook = (response) => {
    Api.post("api/v1/user/login", {
      faceBookId: response.id,
      isFaceBookLogin: true,
      firstName: response.first_name,
      lastName: response.last_name,
      email: response.email,
    })
      .then((res) => {
        const data = res.data.user;
        const token = data.token;
        const parentId = data.parentId ? data.parentId : null;
        const studentId = data.studentId ? data.studentId : null;
        const teacherId = data.teacherId ? data.teacherId : null;
        const role = data.role;
        const userId = data.id;
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("parentId", parentId);
        localStorage.setItem("studentId", studentId);
        localStorage.setItem("teacherId", teacherId);
        localStorage.setItem("sessionId", token);
        const isStudent = role === ROLES_STUDENT;
        if (!res.data.dataVerified) {
          isStudent &&
            this.props.history.push({
              pathname: `/edit/student/details/${studentId}`,
              state: {
                aliasName: this.state.aliasName,
              },
            });
        }
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      });
  };

  // Error Handler
  responseGoogleError = (response) => {};

  // Login
  loginUser = (values, { resetForm }) => {
    const email = values.email.toLowerCase();
    Api.post("api/v1/user/login", {
      email: email,
      password: values.password,
    })
      .then((response) => {
        resetForm({ values: "" });
        const status = response.data.status;
        if (status === "Created") {
          const token = response.data.user.token;
          const parentId = response.data.user.parentId;
          const studentId = response.data.user.studentId;
          const role = response.data.user.role;
          const userId = response.data.user.id;
          const userName = response.data.user.email;
          localStorage.setItem("sessionId", token);
          localStorage.setItem("parentId", parentId);
          localStorage.setItem("studentId", studentId);
          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userName", userName);
          this.setState({ show: !this.state.show });
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      });
  };

  // studentList
  studentList = () => {
    const token = localStorage.getItem("sessionId");
    const parentId = localStorage.getItem("parentId");
    Api.get("/api/v1/parent/student/list", {
      params: {
        parentId: parentId,
        token: token,
      },
    }).then((res) => {
      const data = res.data.data.studentList;
      this.setState({ studentList: data, isLoading: false });
    });
  };

  //AdminCourse Details
  getAdminCourseDetails() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("sessionId");
    Api.get(`/api/v1/course/detail/admin/${this.state.aliasName}`, {
      params: {
        userId: userId,
        token: token,
      },
    }).then((res) => {
      const data = res.data.data;

      this.setState({
        courseData: data.courseDetail,
        lessonDetail: data.lessonDetail,
        scheduleDetail: data.scheduleDetail,
        isLoading: false,
        spinner: false,
      });
    });
  }

  // get Course Details
  getCourseDetails = (values) => {
    const sessionId = localStorage.getItem("sessionId");
    const cDate = Date.now();
    const currentDate = moment(cDate).tz("America/Chicago").format("ll");
    this.setState({ token: sessionId, currentDate: currentDate });
    const userId = localStorage.getItem("userId");
    const studentId = localStorage.getItem("studentId");
    const parentId = localStorage.getItem("parentId");
    const token = localStorage.getItem("sessionId");
    const role = localStorage.getItem("role");
    Api.get(`/api/v1/course/detail/${this.state.aliasName}`, {
      params: {
        userId: userId,
        studentId: values?.value ? values?.value : studentId,
        parentId: parentId,
        role: role,
        token: token,
      },
    })
      .then((response) => {
        const data = response.data.data;

        this.setState({
          favourite: data.favourite,
          courseData: data.courseDetail,
          lessonDetail: data.lessonDetail,
          scheduleDetail: data.scheduleDetail,
          checkoutLesson: data.lessondata,
          checkoutId: data.checkoutLesson,
          courseCheckout: data.courseCheckout,
          isLoading: false,
          spinner: false,
        });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  componentDidMount() {
    const role = localStorage.getItem("role");

    if (role === "parent") {
      this.studentList();
    } else if (role === "student") {
      this.getCourseDetails();
    } else {
      this.getAdminCourseDetails();
    }
    // this.getCourseDetails();

    window.scrollTo(0, 0);
  }

  getMultiLessoncheckout = (list) => {
    const lessonDetails = list;

    this.setState({ multiLessonData: lessonDetails });
    let amt = [];
    lessonDetails.map((value) => {
      let amount = parseInt(value.lessonDiscountAmount);
      if (value.isCheckout === false) {
        amt.push(amount);
      }
    });

    let res = 0;
    for (let i = 0; i < amt.length; i++) {
      res += amt[i];
    }

    this.setState({ lessonPayment: res });
    if (res > 0) {
      this.setState({ showMultiplePay: true });
    } else {
      this.setState({ showMultiplePay: false });
    }
  };

  lessonCheckOut = () => {
    const sessionId = localStorage.getItem("sessionId");
    const cDate = Date.now();

    const currentDate = moment(cDate).tz("America/Chicago").format("ll");
    this.setState({ token: sessionId, currentDate: currentDate });
    const { multiLessonData, courseId, aliasName, lessonScheduleId, lessonPayment } = this.state;
    let lessonIds = [];

    multiLessonData?.map((list) => {
      lessonIds.push(list);
    });

    let lessonId = [];
    lessonId.push({ id: this.state.lessonIds, lessonDiscountAmount: lessonPayment });
    if (currentDate < lessonScheduleId.startDate) {
      this.props.history.push({
        pathname: `/course/checkout/${aliasName}`,
        state: {
          courseId: courseId,
          lessonPayment: lessonPayment,
          scheduleId: lessonScheduleId,
          lessonIds: this.state.lessonIds.length > 0 ? lessonId : lessonIds,
        },
      });
    } else {
      this.setState({ isSchedule: true });
    }
  };

  onSubmitFavourite = (list) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("sessionId");
    Api.post(`api/v1/favouriteCourse`, {
      courseId: list,
      userId: userId,
      token: token,
    })
      .then((response) => {
        this.getCourseDetails();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  // Table Heading
  columns = [
    {
      title: "Lesson",
      width: "5%",
      render: (rowData) => `Lesson-${rowData.tableData.id + 1}`,
    },
    { title: "Lesson Name", field: "lessonName" },
    {
      title: "Description",
      render: (rowData) => (
        <p
          className="ellipsis-text-details"
          dangerouslySetInnerHTML={this.convertFromJSONToHTML(`${rowData.description}`)}
        ></p>
      ),
      cellStyle: {
        maxWidth: 450,
      },
    },
    {
      title: (
        <div>
          <p className="mb-0">Durations</p>
          <p className="mb-0">(in Hours)</p>
        </div>
      ),
      render: (rowData) => `1 `,
    },
    {
      title: "Price",
      render: (rowData) => (
        <div className="d-flex">
          <p className="mx-2">${rowData.lessonDiscountAmount}</p>
          <p className="amount-text">${rowData.lessonActualAmount} </p>
        </div>
      ),
    },

    {
      title: "Enroll Lesson",
      render: (rowData) => (
        <>
          {this.state.role ? (
            this.state.role === "admin" || this.state.role === "teacher" ? (
              <Link to="#" className="purchased-course fw-bold">
                Checkout
              </Link>
            ) : rowData.isCheckout === true ? (
              <Link to="#" className="purchased-course fw-bold">
                Purchased
              </Link>
            ) : (
              <Link
                className="fw-bold checkout-clr"
                to="#"
                onClick={() => {
                  this.setState({
                    isLessonCheckOut: true,
                    courseId: rowData?.courseId,
                    lessonPayment: rowData?.lessonDiscountAmount,
                    lessonIds: rowData?.id,
                    lessonNumber: rowData?.lessonNumber,
                    showMultiplePay: true,
                  });
                }}
              >
                Checkout
              </Link>
            )
          ) : (
            <Link to={"/login"} className="fw-bold checkout-clr">
              Checkout
            </Link>
          )}
        </>
      ),
    },
  ];

  render() {
    const {
      courseData,
      lessonDetail,
      scheduleDetail,
      isLoading,
      token,
      favourite,
      role,
      user,
      courseCheckout,
      studentList,
      currentDate,
    } = this.state;
    const studentId = localStorage.getItem("studentId");
    const parentId = localStorage.getItem("parentId");
    return (
      <Container className="py-3">
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Row>
              <Col sm={12} md={9} lg={8}>
                {role === "parent" ? (
                  studentList.length > 0 ? (
                    <div className="mt-3">
                      <label>Select Student :</label>
                      <Select
                        placeholder="Select Student"
                        styles={customStyles}
                        options={studentList?.map((list) => ({
                          // value: list?.id,
                          value: list?.id,
                          label: `${list?.firstName} ${list?.lastName}`,
                          isDisabled: list?.activeStatus,
                        }))}
                        onChange={(e) => {
                          this.getCourseDetails(e);
                        }}
                      />
                    </div>
                  ) : (
                    <Row>
                      <p className="mt-3 text-center">Student Yet to be Created</p>
                      <Col className="d-flex justify-content-center mt-3">
                        <Button>
                          <Link to={"/student/signup"}>Create Student</Link>
                        </Button>
                      </Col>
                    </Row>
                  )
                ) : null}
              </Col>
            </Row>
            {courseData ? (
              <div className="mt-4">
                <Row>
                  <Col xs={12} sm={9} className="height:auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex">
                        <h4>{`${courseData?.category?.name} - ${courseData?.name}`}</h4>

                        {role === "admin" || user === null ? null : favourite === true ? (
                          <FontAwesomeIcon
                            icon={fasfaHeart}
                            color="crimson"
                            className="mb-0 ms-3"
                            style={{ fontSize: 24, cursor: "pointer" }}
                            onClick={() => {
                              this.setState({ spinner: true });
                              this.onSubmitFavourite(courseData?.id);
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={farfaHeart}
                            color="black"
                            className="mb-0 ms-3"
                            style={{ fontSize: 24, cursor: "pointer" }}
                            onClick={() => {
                              this.setState({ spinner: true });
                              this.onSubmitFavourite(courseData?.id);
                            }}
                          />
                        )}
                      </div>

                      <div className="d-flex align-items-center " style={{ flexWrap: "wrap" }}>
                        <h5>Amount : </h5>
                        <h5 className="discount-amt-txt mb-2 ms-1"> ${courseData?.discountAmount} </h5>
                        <h5 className="actual-amt-txt mb-2">${courseData?.actualAmount}</h5>
                      </div>
                    </div>

                    <Divider />
                  </Col>
                  <Col xs={12} sm={9} className="height:auto">
                    <p dangerouslySetInnerHTML={this.convertFromJSONToHTML(courseData?.description)}></p>
                    <Divider />
                  </Col>
                  <Col xs={12} sm={3} className="course-image-style">
                    {courseData?.imageUrl === undefined || courseData?.imageUrl === null ? (
                      <img
                        className="image-heigh"
                        src="https://static.wikia.nocookie.net/just-because/images/0/0c/NoImage_Available.png/revision/latest?cb=20170601005615"
                        alt="Snow"
                        width={"100%"}
                        height={"100%"}
                      />
                    ) : (
                      <img src={courseData?.imageUrl} className="img-fluid" alt="" />
                    )}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <h4 className="row-main">Available Timing (Central Time)</h4>
                  {scheduleDetail?.length > 0 ? (
                    scheduleDetail?.length < 3 ? (
                      scheduleDetail.map((scheduleDetail, i) => (
                        <Col xs={12} sm={6} md={6} lg={4} className="mt-3">
                          <Card className="shadow available-time pt-2 ">
                            <Row className="d-flex px-3 py-1 course-checout-card-width">
                              <Col className="ms-1 detail-col-tag">
                                <p className=" form_text1 mb-1 ">Every</p>
                              </Col>
                              <Col className="ms-1 detail-col-tag">
                                <text className=" detail-page-pTag mb-1 ">: {scheduleDetail?.weeklyOn}</text>
                              </Col>
                            </Row>
                            <Row className="d-flex px-3 py-1 course-checout-card-width">
                              <Col className="ms-1 detail-col-tag">
                                <p className=" form_text1 mb-1 ">Start Date</p>
                              </Col>
                              <Col className="ms-1 ">
                                <p className=" detail-page-pTag mb-1 "> : {scheduleDetail?.startDate}</p>
                              </Col>
                            </Row>
                            <Row className="d-flex ps-3 pe-2 py-1 course-checout-card-width">
                              <Col className="ms-1 detail-col-tag">
                                <p className=" form_text1 mb-1 ">Schedule</p>
                              </Col>
                              <Col className="ms-1 detail-col-tag ">
                                <p className=" detail-page-pTag mb-1 ">
                                  : {`${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`}
                                </p>
                              </Col>
                            </Row>
                            <div>
                              {scheduleDetail?.teacherId?._id ? (
                                <Link
                                  className="row mx-3 mb-2 text-decoration-none hover-zoom"
                                  onClick={() =>
                                    this.props.history.push({
                                      pathname: `/teacher/profile/view`,
                                      state: {
                                        teacherId: scheduleDetail?.teacherId?._id,
                                      },
                                    })
                                  }
                                >
                                  <Col xs={5} className="teachers-profile-image">
                                    <Avatar
                                      name={`${scheduleDetail?.teacherId?.firstName} ${scheduleDetail?.teacherId?.lastName}`}
                                      size="40"
                                      round={true}
                                      color="silver"
                                    />
                                  </Col>
                                  <Col xs={7} className="teacher-detail px-3">
                                    <span>
                                      <h5 className="teachers-name mb-0">
                                        {scheduleDetail?.teacherId?.firstName} {scheduleDetail?.teacherId?.middleName}{" "}
                                        {scheduleDetail?.teacherId?.lastName}
                                      </h5>
                                    </span>
                                  </Col>
                                </Link>
                              ) : (
                                <Link className="row mx-3 mb-2 text-decoration-none">
                                  <Col xs={4} className="teachers-profile-image">
                                    <Avatar
                                      src={"https://www.freeiconspng.com/thumbs/warning-icon-png/warning-icon-28.png"}
                                      size="38"
                                      round={true}
                                      color="silver"
                                    />
                                  </Col>
                                  <Col xs={8} className="no-teacher-detail px-3">
                                    <span>
                                      <h6 className="teachers-not-name mb-0">Teacher Not Updated</h6>
                                      <h6 className="teachers-not-spec"> Right Now</h6>
                                    </span>
                                  </Col>
                                </Link>
                              )}
                            </div>
                            <Card.Footer className="course-detail-footer">
                              {scheduleDetail?.teacherId?._id ? (
                                token !== null ? (
                                  <div>
                                    {role === "admin" || role === "teacher" ? (
                                      <Link className="enroll-link-disable" to={"#"} onClick={() => {}}>
                                        Enroll
                                      </Link>
                                    ) : studentId === courseCheckout?.studentId ||
                                      parentId === courseCheckout?.parentId ? (
                                      <Link className="enroll-link-disable" disabled>
                                        Enroll
                                      </Link>
                                    ) : currentDate > scheduleDetail.startDate ? (
                                      <Link className="enroll-link-disable" disabled>
                                        Enroll
                                      </Link>
                                    ) : (
                                      <Link
                                        className="enroll-link"
                                        to={{
                                          pathname: `/course/checkout/${courseData?.aliasName}`,
                                          state: {
                                            courseId: courseData?.id,
                                            scheduleId: scheduleDetail?.id,
                                            scheduleDetail: scheduleDetail,
                                            coursePayment: courseData?.discountAmount,
                                          },
                                        }}
                                        onClick={() => {
                                          const time = `${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`;
                                          localStorage.setItem("courseTiming", time);
                                        }}
                                      >
                                        Enroll
                                      </Link>
                                    )}
                                  </div>
                                ) : (
                                  <Link className="enroll-link" to={"/login"}>
                                    Enroll
                                  </Link>
                                )
                              ) : (
                                <Link className="enroll-link-disable" to={"#"} onClick={() => {}}>
                                  Enroll
                                </Link>
                              )}
                            </Card.Footer>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Carousel breakPoints={breakPoints}>
                        {scheduleDetail.map((scheduleDetail, i) => (
                          <Card className="shadow available-time">
                            <Row className="d-flex px-3 py-1 course-checout-card-width">
                              <Col className="ms-1 detail-col-tag">
                                <p className=" form_text1 mb-1 fw-bold">Every</p>
                              </Col>
                              <Col className="ms-1 detail-col-tag">
                                <text className=" detail-page-pTag mb-1 ">: {scheduleDetail?.weeklyOn}</text>
                              </Col>
                            </Row>
                            <Row className="d-flex px-3 py-1 course-checout-card-width">
                              <Col className="ms-1 detail-col-tag">
                                <p className=" form_text1 mb-1 fw-bold">Start Date</p>
                              </Col>
                              <Col className="ms-1 ">
                                <p className=" detail-page-pTag mb-1 "> : {scheduleDetail?.startDate}</p>
                              </Col>
                            </Row>
                            <Row className="d-flex ps-3 pe-2 py-1 course-checout-card-width">
                              <Col className="ms-1 detail-col-tag">
                                <p className=" form_text1 mb-1 fw-bold">Schedule</p>
                              </Col>
                              <Col className="ms-1 detail-col-tag ">
                                <p className=" detail-page-pTag mb-1 ">
                                  : {`${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`}
                                </p>
                              </Col>
                            </Row>
                            {scheduleDetail?.teacherId?._id ? (
                              <div
                                className="row teacher-detail-sec mb-2"
                                onClick={() =>
                                  this.props.history.push({
                                    pathname: `/teacher/profile/view`,
                                    state: {
                                      teacherId: scheduleDetail?.teacherId?._id,
                                    },
                                  })
                                }
                              >
                                <Col xs={5} className="teachers-profile-image">
                                  <Avatar
                                    name={`${scheduleDetail?.teacherId?.firstName} ${scheduleDetail?.teacherId?.lastName}`}
                                    size="45"
                                    round={true}
                                    color="silver"
                                  />
                                </Col>
                                <Col xs={7} className="teacher-detail px-3">
                                  <span>
                                    <h5 className="teachers-name mb-0">
                                      {scheduleDetail?.teacherId?.firstName} {scheduleDetail?.teacherId?.middleName}{" "}
                                      {scheduleDetail?.teacherId?.lastName}
                                    </h5>
                                  </span>
                                </Col>
                              </div>
                            ) : (
                              <div className="row mb-2">
                                <Col xs={4} className="teachers-profile-image">
                                  <Avatar
                                    src={"https://www.freeiconspng.com/thumbs/warning-icon-png/warning-icon-28.png"}
                                    size="38"
                                    round={true}
                                    color="silver"
                                  />
                                </Col>
                                <Col xs={8} className="no-teacher-detail px-2">
                                  <span>
                                    <h6 className="teachers-not-name mb-0">Teacher Not Updated</h6>
                                    <h6 className="teachers-not-spec"> Right Now</h6>
                                  </span>
                                </Col>
                              </div>
                            )}
                            <Card.Footer>
                              {scheduleDetail?.teacherId?._id ? (
                                token !== null ? (
                                  <div>
                                    {role === "admin" || role === "teacher" ? (
                                      <Link className="enroll-link-disable" to={"#"} onClick={() => {}}>
                                        Enroll 1
                                      </Link>
                                    ) : (
                                      <Link
                                        className="enroll-link"
                                        to={{
                                          pathname: `/course/checkout/${courseData?.aliasName}`,
                                          state: {
                                            courseId: courseData?.id,
                                            scheduleId: scheduleDetail?.id,
                                            scheduleDetail: scheduleDetail,
                                            coursePayment: courseData?.discountAmount,
                                          },
                                        }}
                                        onClick={() => {
                                          const time = `${scheduleDetail?.startTime} - ${scheduleDetail?.endTime}`;
                                          localStorage.setItem("courseTiming", time);
                                        }}
                                      >
                                        Enroll 2
                                      </Link>
                                    )}
                                  </div>
                                ) : (
                                  <Link
                                    className="enroll-link"
                                    to={"#"}
                                    onClick={() => {
                                      this.setState({ show: true });
                                    }}
                                  >
                                    Enroll 3
                                  </Link>
                                )
                              ) : (
                                <Link className="enroll-link-disable" to={"#"} onClick={() => {}}>
                                  Enroll 4
                                </Link>
                              )}
                            </Card.Footer>
                          </Card>
                        ))}
                      </Carousel>
                    )
                  ) : (
                    <div className="d-flex justify-content-center">
                      <h6>No Scheduled Timing</h6>
                    </div>
                  )}
                </Row>
                <Row className="mt-5">
                  <div className="row-main-lessoncheckout ">
                    <div>
                      <h4>Course Lessons</h4>
                    </div>
                    <div className="mb-3">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!this.state.showMultiplePay}
                        className={`${!this.state.showMultiplePay ? "create-disable" : "create-active"}`}
                        onClick={() =>
                          token ? this.setState({ isLessonCheckOut: true }) : this.props.history.push("/login")
                        }
                      >
                        Pay Now ${this.state.lessonPayment ? this.state.lessonPayment : 0}
                      </Button>
                      <div></div>
                    </div>
                  </div>
                  <div className="material-table-responsive mb-3">
                    <ThemeProvider theme={tableTheme}>
                      <MaterialTable
                        icons={tableIcons}
                        data={lessonDetail}
                        columns={this.columns}
                        onSelectionChange={(lessonDetail) => {
                          this.getMultiLessoncheckout(lessonDetail);
                        }}
                        localization={{
                          body: {
                            emptyDataSourceMessage: "Lessons Not Created",
                          },
                        }}
                        options={{
                          actionsColumnIndex: -1,
                          addRowPosition: "last",
                          headerStyle: {
                            fontWeight: "bold",
                            zIndex: 0,
                            backgroundColor: "#1d1464",
                            color: "white",
                          },
                          showTitle: false,
                          search: false,
                          toolbar: false,
                          selection: role === "admin" || role === "teacher" ? false : true,
                          selectionProps: (rowData) =>
                            rowData.isCheckout === true
                              ? {
                                  disabled:
                                    rowData.isCheckout === true
                                      ? true || currentDate > scheduleDetail.startDate
                                      : false,
                                  color: "success",
                                  checked: rowData.isCheckout === true ? true : false,
                                }
                              : { color: "primary" },
                        }}
                      />
                    </ThemeProvider>
                  </div>
                </Row>
                {this.state.spinner && (
                  <div className="spanner">
                    <Spinner animation="grow" variant="light" />
                    <span>
                      <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
                    </span>
                  </div>
                )}
                <Modal
                  show={this.state.isLessonCheckOut}
                  centered
                  onHide={() => {
                    this.ModalClose();
                  }}
                >
                  <Modal.Body id="contained-modal-title-vcenter">
                    <div className="container py-3 px-3">
                      <div className="row flex-direction-row">
                        <h3 className=" d-flex justify-content-center align-self-center ">Schedule Details</h3>
                      </div>
                      <Formik>
                        {(formik) => {
                          const { isValid } = formik;
                          return (
                            <div className="mt-0">
                              <div className="mt-3">
                                <Row>
                                  <Form className="category-form-style">
                                    <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                                      <Label notify={true}>Select Time Slot</Label>
                                      <Select
                                        className="form-styles align-self-center"
                                        type="text"
                                        styles={customStyles}
                                        placeholder="Select Schedule"
                                        value={this.state.lessonSchedule}
                                        onChange={(e) => {
                                          this.setState({
                                            lessonSchedule: e,
                                            lessonScheduleId: e.lessonScheduleId,
                                            courseId: e.lessonScheduleId.courseId,
                                          });
                                        }}
                                        options={scheduleDetail.map((item) => ({
                                          label:
                                            currentDate > item.startDate
                                              ? "Schedule Expired"
                                              : item.teacherId
                                              ? item.startDate +
                                                "-" +
                                                item.endTime +
                                                " to " +
                                                item.endTime +
                                                " (" +
                                                item.weeklyOn +
                                                ")"
                                              : null,
                                          value:
                                            currentDate > item.startDate
                                              ? "Schedule Expired"
                                              : item.teacherId
                                              ? item.startDate +
                                                "-" +
                                                item.endTime +
                                                " to " +
                                                item.endTime +
                                                " (" +
                                                item.weeklyOn +
                                                ")"
                                              : null,
                                          lessonScheduleId: item,
                                        }))}
                                      />
                                    </Form.Group>
                                  </Form>
                                </Row>
                                <Row className="button-content-style">
                                  <Col xs={6} sm={6} md={6}>
                                    <Button
                                      fullWidth
                                      className="Kharpi-cancel-btn"
                                      color="#fff"
                                      style={{ width: "100%", borderRadius: 5 }}
                                      onClick={() =>
                                        this.setState({
                                          isLessonCheckOut: false,
                                          lessonSchedule: "",
                                        })
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </Col>
                                  <Col xs={6} sm={6} md={6}>
                                    {role === "admin" || role === "teacher" ? (
                                      <div></div>
                                    ) : (
                                      <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={`${
                                          !isValid || !this.state.showMultiplePay || !this.state.lessonSchedule
                                            ? "create-disable"
                                            : "create-active"
                                        }`}
                                        onClick={() => this.lessonCheckOut()}
                                      >
                                        Pay Now ${this.state.lessonPayment}
                                      </Button>
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          );
                        }}
                      </Formik>
                    </div>
                  </Modal.Body>
                </Modal>
                <Modal
                  show={this.state.isSchedule}
                  centered
                  onHide={() => {
                    this.scheduleClose();
                  }}
                >
                  <Modal.Body className="d-flex justify-content-center">
                    <FontAwesomeIcon className="text-center" size={50} icon={faWarning} />
                    <p>Please select valid schedule</p>
                  </Modal.Body>
                  <Modal.Footer className="d-flex justify-content-center">
                    <Button onClick={this.scheduleClose}>OK</Button>
                  </Modal.Footer>
                </Modal>
              </div>
            ) : null}
          </div>
        )}
      </Container>
    );
  }
}
