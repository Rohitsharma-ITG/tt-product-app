import { useState, useEffect } from 'react'; // MouseEvent
import {
  GetProp,
  Button,
  Col,
  Row,
  Form,
  Select,
  Input,
  Tabs,
  Popconfirm,
  PopconfirmProps,
  Modal,
  Upload,
  Checkbox,
  UploadFile,
  UploadProps,
  message,
  Spin,
} from "antd";
import ImgCrop from 'antd-img-crop';
import { useNavigate } from "react-router-dom";
import type { TabsProps } from 'antd';
import { ReloadOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Api } from "../../../../components/api.ts";
import { CardImageHereToSlayResponse, CardImageHereToSlay } from "../../../../dto/card-image.ts";
import type { Callbacks } from "rc-field-form/lib/interface";
import { DefaultOptionType } from "rc-select/lib/Select";
// import { useNavigate } from "react-router-dom";
// import { Api } from '../../../../components/api';

export default function HereToSlayCreatePage() {
  const api = new Api();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const [messageApi, contextHolder] = message.useMessage();

  const [spinning, setSpinning] = useState(false);
  const [effectHintMessage, setEffectHintMessage] = useState<string>('');
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);
  const [imageUrl, setImageUrl] = useState<string>();
  const [showCustomTextArea, setShowCustomTextArea] = useState<boolean>(false);
  const [selectedImgThumb, setSelectedImgThumb] = useState<number>(0);
  const [isThumbModalOpen, setIsThumbModalOpen] = useState<boolean>(false);
  const [selectedTabKey, setSelectedTabKey] = useState<string>('1');
  const [thumbModal, setThumbModal] =
    useState<{id: number, img: string}>({id: 0, img: ''});

  const [cardImages, setCardImages] =
    useState<CardImageHereToSlay[]>([]);

  useEffect(() => {
    fetchCardImages();
  }, []); // Refetch cards when the sort option changes

  // const fetchHelloText = async () => {
  //   const res = await api.getHello();
  //   setHelloText(res ? res : '');
  // };

  const fetchCardImages = async () => {
    const res: CardImageHereToSlayResponse = await api.getCardImagesHereToSlay();
    setCardImages(res.items);
  };

  // const handleScroll = useCallback(() => {
  //   if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight && hasMore) {
  //     fetchCards();
  //   }
  // }, [hasMore, loading]);

  const handleEffectChange = (value: string, option: DefaultOptionType) => {
    setEffectHintMessage(option.label?.toString() ?? '');
    setShowCustomTextArea(value === "custom");
  };

  const handleThumbClick = (id: number, img: string) => () => { // (value: MouseEvent<HTMLAnchorElement>) =>
    setThumbModal({
      id: id,
      img: img,
    });
    showThumbModel();
  };

  const handlerChangeTab = (tabKey: string) => {
    if (tabKey == '2') {
      resetThumbSelection();
    }
    setSelectedTabKey(tabKey);
  }

  const handlerStartOverConfirm: PopconfirmProps['onConfirm'] = () => {
    resetForm();
  };

  const handlerThumbModelOk = () => {
    setSelectedImgThumb(thumbModal.id);
    hideThumbModal();
  };

  const handlerThumbModelCancel = () => {
    hideThumbModal();
  };

  const showThumbModel = () => {
    setIsThumbModalOpen(true);
  };

  const hideThumbModal = () => {
    setIsThumbModalOpen(false);
  };

  // const handlerStartOverCancel: PopconfirmProps['onCancel'] = (e) => {
  //   resetForm();
  // };

  const resetForm = () => {
    form.resetFields();
    setShowCustomTextArea(false);
    resetThumbSelection();
    resetImages();
  }

  const resetThumbSelection = () => {
    setSelectedImgThumb(0);
  }

  const resetImages = () => {
    setImageUrl('');
  }

  // const normFile = (e: any) => {
  //   console.log(e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

  const handleImageChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'removed') {
      return;
    }
    // console.log(info.file.originFileObj);
    getBase64(info.file.originFileObj as FileType, (url) => {
      setImageUrl(url);
    });
  };

  // const onPreview = async (file: UploadFile) => {
  //   console.log(file);
  //   let src = file.url as string;
  //   if (!src) {
  //     src = await new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file.originFileObj as FileType);
  //       reader.onload = () => resolve(reader.result as string);
  //     });
  //   }
  //   const image = new Image();
  //   image.src = src;
  //   const imgWindow = window.open(src);
  //   imgWindow?.document.write(image.outerHTML);
  // };

  const imageUploadProps: UploadProps = {
    onRemove: (file) => {
      const index = imageFileList.indexOf(file);
      const newFileList = imageFileList.slice();
      newFileList.splice(index, 1);
      form.setFieldsValue({
        'base_image': []
      });
      setImageFileList(newFileList);
    },
    beforeUpload: (file) => {
      // console.log(file);
      form.setFieldsValue({
        'base_image': [file]
      });
      setImageFileList([...imageFileList, file]);
      return true;
    },
    //onPreview: onPreview,
    maxCount: 1,
    onChange: handleImageChange,
    showUploadList: false,
    listType: "picture-card",
    fileList: imageFileList,
  };

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const toBase64 = (img: FileType) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const submitForm: Callbacks['onFinish'] = async (values) => {
    console.log(values);
    setSpinning(true);
    const formData = new FormData();
    for (const key in values) {
      if (values[key] == undefined) {
        values[key] = '';
      }
      if ((key === 'base_image') && values[key]) {
        const base64Str = await toBase64(values[key][0]);
        formData.append(key, base64Str as string);
        continue;
      }
      formData.append(key, values[key]);
    }
    if (selectedTabKey == '1') {
      if (!selectedImgThumb) {
        messageApi.open({
          type: 'error',
          content: 'Please select an image',
          style: {bottom: 10},
        });
        setSpinning(false);
        return;
      }
      formData.append('image_thumb', selectedImgThumb.toString());
    } else {
      formData.append('image_thumb', '0');
    }
    const res = await api.submitHereToSlayForm(formData);
    if (res.error) {
      messageApi.open({
        type: 'error',
        content: res.error,
        duration: 10,
        style: {bottom: 10},
      });
    } else if (res.cardToken) {
      navigate(`/apps/ugapp/cards/here-to-slay/view?t=${res.cardToken}`);
    }
    setSpinning(false);

    // // You can use any AJAX library you like
    // fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     console.log('Uploaded');
    //     // setFileList([]);
    //     // message.success('upload successfully.');
    //   })
    //   .catch(() => {
    //     console.log('Upload error');
    //     //message.error('upload failed.');
    //   })
    //   .finally(() => {
    //     console.log('Upload finally');
    //     // setUploading(false);
    //   });
  };

  const formTabs: TabsProps['items'] = [
    {
      key: '1',
      label: 'Choose An Image',
      children: <div className="hts-artworks-img-list">
        {cardImages.map((cardImage) => (
          <a className={"hts-artworks" + (selectedImgThumb === cardImage.id ? ' selected' : '')}
             key={cardImage.id}
             onClick={handleThumbClick(cardImage.id, cardImage.src)}>
            <img className="img-thumb" src={cardImage.thumb} alt={cardImage.name}/>
          </a>
          )
        )}
      </div>,
    },
    {
      key: '2',
      label: 'Upload Your Own',
      children: <div className="hts-upload-block">
        <Row>
          <Col span={24}>
            <Form.Item
              name="base_image"
              valuePropName="fileList"
              // getValueFromEvent={normFile}
              rules={[{ required: selectedTabKey == "2", message: 'The image cannot be blank!' }]}>
              <ImgCrop
                aspect={0.6} // 300px/500px
                modalOk={"Ok"}
                modalCancel={"Close"}
                modalProps={{
                  okButtonProps: {
                    className: 'cs-crop-upload-ok-btn',
                  },
                  cancelButtonProps: {
                    className: 'cs-crop-upload-cancel-btn',
                  },
                }}
              >
                <Upload {...imageUploadProps}
                  // customRequest={() => true}
                  // showUploadList={false}
                  // maxCount={1}
                  // action="/upload.do"
                  //listType="picture-card"
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }}/> :
                    <button style={{ border: 0, background: 'none' }} type="button">
                      <PlusOutlined/>
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </button>}

                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </Row>
        <div className="hts-upload-desc">
          <p>
            Upload a JPG or PNG that is no larger than 10MB<br />
            Recommended dimensions: 1000px by 1000px
          </p>
          <p>
            Please note that if you choose to upload your own artwork, you will not be able to submit your creation to the community site.
          </p>
          <Form.Item name="terms" label="" valuePropName="checked" rules={[{ required: selectedTabKey == "2", message: 'The field cannot be blank!' }]}>
            <Checkbox>
              I agree to the <a href="https://unstablegames.com/pages/terms-of-use" target="_blank">terms and conditions <ExportOutlined /></a>
            </Checkbox>
          </Form.Item>
        </div>
      </div>,
    },
  ];

  return (
    <div className="hts-here-to-slay">
      <h1>Begin Customizing Your Card</h1>
      <Row justify="center">
        <Col xs={24} lg={12}>
          <Form
            layout='vertical'
            form={form}
            initialValues={{ shadow_effect: '' }}
            onFinish={submitForm}
            // onValuesChange={onFormLayoutChange}
            // style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
          >
            <Form.Item name="character_name" label="1. Name your Party Leader"
                       rules={[{ required: true, message: 'The field cannot be blank!' }]}>
              <Input placeholder="input placeholder"/>
            </Form.Item>
            <Form.Item name="character_class" label="2. Select your Party Leader’s class"
                       rules={[{ required: true, message: 'The field cannot be blank!' }]}>
              <Select
                style={{ width: '100%', textAlign: 'left' }}
                options={[
                  { value: '', label: '' },
                  { value: 'Bard', label: 'Bard Party Leader' },
                  { value: 'Fighter', label: 'Fighter Party Leader' },
                  { value: 'Guardian', label: 'Guardian Party Leader' },
                  { value: 'Ranger', label: 'Ranger Party Leader' },
                  { value: 'Thief', label: 'Thief Party Leader' },
                  { value: 'Wizard', label: 'Wizard Party Leader' },
                  { value: 'Warrior', label: 'Warrior Party Leader' },
                  { value: 'Druid', label: 'Druid Party Leader' },
                ]}
              />
            </Form.Item>
            <Form.Item name="character_effect" label="3. Select your Party Leader’s effect"
                       rules={[{ required: true, message: 'The field cannot be blank!' }]}>
              <Select
                style={{ width: '100%', textAlign: 'left' }}
                onChange={handleEffectChange}
                options={[
                  { value: '', label: '' },
                  { value: 'effect1', label: 'Each time you roll to CHALLENGE, +2 to your roll.' },
                  { value: 'effect2', label: 'Each time you play a Modifier card on a roll, +1 or -1 to that roll.' },
                  { value: 'effect3', label: 'Each time you play a Magic card, DRAW a card.' },
                  { value: 'effect4', label: 'Each time you roll to use a Hero\'s effect, +1 to your roll.' },
                  { value: 'effect5', label: 'Each time you roll to ATTACK, +1 to your roll.' },
                  {
                    value: 'effect6',
                    label: 'Once per turn on your turn, you may spend 1 action point to pull a card from another player\'s hand.'
                  },
                  { value: 'custom', label: 'Custom' },
                ]}
              />
            </Form.Item>

            <div className={effectHintMessage != '' ? "hts-hint-message" : "hts-hint-message-hidden"}>
              {effectHintMessage}
            </div>

            <Form.Item label="" name="character_effect_custom"
                       rules={[{ required: showCustomTextArea, message: 'The field cannot be blank!' }]}
                       style={{ display: showCustomTextArea ? 'block' : 'none' }}>
              <TextArea showCount maxLength={105} rows={4}/>
            </Form.Item>

            <div className="hts-image-selection-wrapper">
              <div>4. Artwork</div>
              <div style={{ backgroundColor: '#f1eeed', padding: '0 10px 10px 10px' }}>
                <Tabs defaultActiveKey="1"
                      items={formTabs}
                      onChange={handlerChangeTab}
                />
              </div>
            </div>
            <Row style={{ marginTop: '20px' }}>
              <Col span={12} style={{ textAlign: 'left' }}>
                <Form.Item>
                  <Button onClick={() => navigate('/apps/ugapp/cards/here-to-slay')} style={{marginRight: '10px'}}>Cancel</Button>
                  <Popconfirm
                    title="Are you sure to start over?"
                    // description="Are you sure to start over?"
                    onConfirm={handlerStartOverConfirm}
                    // onCancel={handlerStartOverCancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<ReloadOutlined/>}>Start Over</Button>
                  </Popconfirm>
                </Form.Item>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                {contextHolder}
                <Form.Item>
                  <Button type="primary" htmlType="submit">Continue</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Spin spinning={spinning} size="large" fullscreen/>
      <Modal className={"hts-thumb-modal"}
        // title="Basic Modal"
             okText={"Select Image"}
             cancelText={"Close"}
             cancelButtonProps={
               {
                 style: {
                   textTransform: 'none',
                   backgroundColor: '#fff',
                   border: 'none',
                   color: '#000000',
                   fontWeight: '400',
                   boxShadow: 'none',
                 }
               }
             }
             open={isThumbModalOpen}
             onOk={handlerThumbModelOk}
             onCancel={handlerThumbModelCancel}
      >
        <div style={{
          margin: '0 5px'
        }}>
          <img style={
            {
              height: 'auto',
              maxWidth: '300px',
            }
          }
               className="base-image"
               src={thumbModal.img} alt=""/>
        </div>
      </Modal>
      {/*{loading && <div className="loading-indicator">Loading...</div>}*/}
    </div>
  );
}
