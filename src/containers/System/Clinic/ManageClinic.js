import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import { createNewClinic, getAllClinic, getAllDetailClinicById, getAllDetailClinicInfo } from "../../../services/userService";
import { toast } from "react-toastify";
import Select from 'react-select';
import * as actions from "../../../store/actions";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      selectedOption: '',
      listClinic: [],
      hasOldData: false,
      previewImgURL: "",
    };
  }

  async componentDidMount() {
    this.props.fetchAllClinic();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }

    const dataSelect = this.buildDataInputSelect(this.props.allClinic)

    if (prevProps.allClinic !== this.props.allClinic) {
      this.setState({
        listClinic: dataSelect
      })
    }

  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, idx) => {
        let object = {};

        object.label = item.name;
        object.value = item.id;
        result.push(object)
      })
    }

    return result;
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        imageBase64: base64,
      });
    }
  };


  handleSaveNewClinic = async () => {
    let { hasOldData } = this.state
    let res = await createNewClinic({
      name: this.state.name,
      address: this.state.address,
      imageBase64: this.state.imageBase64,
      descriptionHTML: this.state.descriptionHTML,
      descriptionMarkdown: this.state.descriptionMarkdown,
      clinicId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
    });
    if (res && res.errCode === 0) {
      toast.success("Add new Clinic succeeds!");
      this.setState({
        name: "",
        imageBase64: "",
        address: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
      });
    } else {
      toast.error("Something wrongs!");
    }
  };

  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };

  handleChange = async (selectedOption) => {
    this.setState({ selectedOption });

    let res = await getAllDetailClinicInfo(selectedOption.value);
    console.log('check data res manage clinic >>', res.data)
    let name = '',
      address = '',
      descriptionHTML = '',
      descriptionMarkdown = '',
      previewImgURL = '',
      imageBase64 = '';

    if (res && res.data) {
      if (res.data.image) {
        previewImgURL = new Buffer(res.data.image, "base64").toString("binary");
      }
      name = res.data.name;
      address = res.data.address;
      descriptionHTML = res.data.descriptionHTML;
      descriptionMarkdown = res.data.descriptionMarkdown;
      // previewImgURL = res.data.image
      imageBase64 = res.data.image

      this.setState({
        name: name,
        address: address,
        descriptionHTML: descriptionHTML,
        descriptionMarkdown: descriptionMarkdown,
        imageBase64: imageBase64,
        previewImgURL: previewImgURL,
        hasOldData: true
      })
    }
  };


  render() {
    console.log('check state clinic>>', this.state)
    console.log('check hasOldata >>.', this.state.hasOldData)
    // console.log('check state clinic >>>', this.state.listClinic)
    let { hasOldData } = this.state
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lý phòng khám</div>

        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Chọn phòng khám</label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.listClinic}
              placeholder={'chọn phòng khám'}
            />
          </div>
          <div className="col-6 form-group">
            <label>Tên phòng khám</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>


          <div className="col-6 form-group">
            <label>Địa chỉ phòng khám</label>
            <input
              className="form-control"
              type="text"
              value={this.state.address}
              onChange={(event) => this.handleOnChangeInput(event, "address")}
            />
          </div>

          <div className="col-6 form-group">
            <label>Ảnh phòng khám</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnChangeImage(event)}
            />
            <div
              className="preview-image"
              style={{
                backgroundImage: `url(${this.state.previewImgURL})`,
              }}
              onClick={() => this.openPreviewImage()}
            ></div>
          </div>


          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12">
            {hasOldData === true ?
              <button
                className="btn-save-specialty"
                onClick={() => this.handleSaveNewClinic()}
              >
                Save
              </button>
              :
              <button
                className="btn-create-new-specialty"
                onClick={() => this.handleSaveNewClinic()}
              >
                Create New
              </button>
            }

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allClinic: state.admin.allClinic
  };

};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllClinic: () => dispatch(actions.fetchAllClinic())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
