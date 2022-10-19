import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  cancelBooking,
  getAllPatientForDoctor,
  postSendRemedy,
  postCreateRemedy,
} from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import CreateImageRemedyModal from "./CreateImageRemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      isOpenCreateImageRemedyModal: false,
      dataModal: {},
      dataModalCreateRemedy: {},
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    await this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    if (user && user.id) {
      let res = await getAllPatientForDoctor({
        doctorId: user.id,
        date: formatedDate,
      });
      if (res && res.errCode === 0) {
        this.setState({
          dataPatient: res.data,
        });
      }
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.user !== prevProps.user) {
      await this.getDataPatient();
    }
  }

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  handleBtnConfirm = (item) => {
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      imageRemedy: item.imageRemedy,
      token: item.token,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };
  handleBtnCreateRemedy = (item) => {
    let name = null;
    if (
      this.props.user &&
      this.props.user.firstName &&
      this.props.user.lastName
    ) {
      name = `${this.props.user.lastName} ${this.props.user.firstName}`;
    }
    if (
      this.props.user &&
      this.props.user.firstName &&
      this.props.user.lastName === null
    ) {
      name = `${this.props.user.firstName}`;
    }
    if (
      this.props.user &&
      this.props.user.firstName === null &&
      this.props.user.lastName
    ) {
      name = `${this.props.user.lastName}`;
    }
    let data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      date: item.date,
      token: item.token,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      doctorName: name,
    };
    this.setState({
      isOpenCreateImageRemedyModal: true,
      dataModalCreateRemedy: data,
    });
  };

  handleBtnCancel = async (item) => {
    this.setState({ isShowLoading: true });
    let res = await cancelBooking({
      doctorId: item.doctorId,
      patientId: item.patientId,
      timeType: item.timeType,
      date: item.date,
      statusId: item.statusId,
    });
    if (res && res.errCode === 0) {
      this.setState({ isShowLoading: false });
      toast.success("cancel appointment succeed!");
      await this.getDataPatient();
    } else {
      this.setState({ isShowLoading: true });
      toast.error("Something wrongs...!");
    }
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };
  closeCreateImageRemedyModal = () => {
    this.setState({
      isOpenCreateImageRemedyModal: false,
      dataModalCreateRemedy: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({ isShowLoading: true });

    let totalCostData = null;
    let specialtyIdData = null;
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.priceTypeData &&
      this.props.user.Doctor_Infor.priceTypeData.valueEn
    ) {
      totalCostData = this.props.user.Doctor_Infor.priceTypeData.valueEn;
    }
    if (
      this.props.user &&
      this.props.user.Doctor_Infor &&
      this.props.user.Doctor_Infor.specialtyId
    ) {
      specialtyIdData = this.props.user.Doctor_Infor.specialtyId;
    }

    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
      totalCost: totalCostData,
      specialtyId: specialtyIdData,
    });
    if (res && res.errCode === 0) {
      this.setState({ isShowLoading: false });
      toast.success("Send Remedy succeed!");
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({ isShowLoading: true });
      toast.error("Something wrongs...!");
    }
    this.setState({ isShowLoading: false });
  };

  createRemedyImage = async (dataChild) => {
    let { dataModalCreateRemedy } = this.state;
    this.setState({ isShowLoading: true });

    let res = await postCreateRemedy({
      email: dataChild.email,
      listMedicine: dataChild.listMedicine,
      desciption: dataChild.desciption,
      doctorId: dataModalCreateRemedy.doctorId,
      patientId: dataModalCreateRemedy.patientId,
      timeType: dataModalCreateRemedy.timeType,
      date: dataModalCreateRemedy.date,
      token: dataModalCreateRemedy.token,
      language: this.props.language,
      patientName: dataModalCreateRemedy.patientName,
      doctorName: dataModalCreateRemedy.doctorName,
    });
    if (res && res.errCode === 0) {
      this.setState({ isShowLoading: false });
      toast.success("Create Remedy succeed!");
      this.closeCreateImageRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({ isShowLoading: true });
      toast.error("Something wrongs...!");
    }
    this.setState({ isShowLoading: false });
  };

  render() {
    let {
      dataPatient,
      isOpenRemedyModal,
      isOpenCreateImageRemedyModal,
      dataModal,
      dataModalCreateRemedy,
    } = this.state;
    let { language } = this.props;

    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner={<ClimbingBoxLoader color={"#86e7d4"} size={15} />}
        >
          <div className="manage-patient-container">
            <div className="m-p-title">Quản lý bệnh nhận khám bệnh</div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group">
                <label>Chọn ngày khám</label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12 table-manage-patient">
                <table>
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th>Họ và tên</th>
                      <th>Địa chỉ</th>
                      <th>Số điện thoại</th>
                      <th>Giới tính</th>
                      <th>Actions</th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient.valueEn;
                        let gender =
                          language === LANGUAGES.VI
                            ? item.patientData.genderData.valueVi
                            : item.patientData.genderData.valueVi;
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{item.patientData.firstName}</td>
                            <td>{item.patientData.address}</td>
                            <td>
                              {item.patientData.phonenumber
                                ? item.patientData.phonenumber
                                : ""}
                            </td>
                            <td>{gender}</td>
                            <td>
                              <button
                                className="mp-btn-confirm"
                                onClick={() => this.handleBtnConfirm(item)}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="mp-btn-confirm"
                                onClick={() => this.handleBtnCreateRemedy(item)}
                              >
                                Tạo đơn thuốc
                              </button>
                              <button
                                className="mp-btn-cancel"
                                onClick={() => this.handleBtnCancel(item)}
                              >
                                Hủy
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          no data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
          <CreateImageRemedyModal
            isOpenCreateImageRemedyModal={isOpenCreateImageRemedyModal}
            dataModalCreateRemedy={dataModalCreateRemedy}
            closeCreateImageRemedyModal={this.closeCreateImageRemedyModal}
            createRemedyImage={this.createRemedyImage}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language, user: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
