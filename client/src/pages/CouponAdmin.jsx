import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  Tag,
  Popconfirm,
  Card,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  PercentageOutlined,
  GiftOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import { useGlobalContext } from "../provider/GlobalProvider";

const { Title, Text } = Typography;

const CouponAdmin = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form] = Form.useForm();
  const { fetchActiveCoupons } = useGlobalContext();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.getAllCouponsAdmin);
      if (response.data.success) {
        setCoupons(response.data.data || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    form.resetFields();
    form.setFieldsValue({
      showInMarquee: true,
      isActive: true,
      minOrderAmount: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingCoupon(record);
    form.setFieldsValue({
      name: record.name,
      discountAmount: record.discountAmount,
      minOrderAmount: record.minOrderAmount || 0,
      description: record.description || "",
      showInMarquee: record.showInMarquee !== undefined ? record.showInMarquee : true,
      isActive: record.isActive !== undefined ? record.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editingCoupon) {
        const response = await Axios({
          ...SummaryApi.updateCoupon,
          data: {
            _id: editingCoupon._id,
            ...values,
          },
        });
        if (response.data.success) {
          toast.success("Coupon updated successfully");
          setIsModalOpen(false);
          fetchCoupons();
          fetchActiveCoupons?.();
        }
      } else {
        const response = await Axios({
          ...SummaryApi.createCoupon,
          data: values,
        });
        if (response.data.success) {
          toast.success("Coupon created successfully");
          setIsModalOpen(false);
          fetchCoupons();
          fetchActiveCoupons?.();
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.deleteCoupon,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success("Coupon deleted successfully");
        fetchCoupons();
        fetchActiveCoupons?.();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (record, field, value) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCoupon,
        data: {
          _id: record._id,
          [field]: value,
        },
      });
      if (response.data.success) {
        toast.success(`Coupon ${field === "isActive" ? "status" : "marquee visibility"} updated`);
        fetchCoupons();
        fetchActiveCoupons?.();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  const columns = [
    {
      title: "Coupon Name / Code",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-extrabold text-sm tracking-wider text-emerald-700 uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block w-fit">
            {text}
          </span>
          {record.description && (
            <span className="text-xs text-gray-500 mt-1">{record.description}</span>
          )}
        </div>
      ),
    },
    {
      title: "Discount Amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (amount) => (
        <span className="font-bold text-gray-900 text-sm">
          ₹{amount}
        </span>
      ),
    },
    {
      title: "Min Order Value",
      dataIndex: "minOrderAmount",
      key: "minOrderAmount",
      render: (val) => (
        <span className="text-gray-700 font-medium text-xs">
          {val > 0 ? `₹${val}` : "None"}
        </span>
      ),
    },
    {
      title: "Show In Marquee",
      dataIndex: "showInMarquee",
      key: "showInMarquee",
      render: (show, record) => (
        <Switch
          checked={show}
          onChange={(checked) => handleToggleStatus(record, "showInMarquee", checked)}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (active, record) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggleStatus(record, "isActive", checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-600" />}
            onClick={() => handleOpenEdit(record)}
          />
          <Popconfirm
            title="Delete Coupon"
            description="Are you sure you want to delete this coupon?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 900, letterSpacing: "-0.5px" }}>
            Coupons & Discounts
          </Title>
          <Text type="secondary" style={{ fontSize: "14px", fontWeight: 500 }}>
            Manage coupon codes and amount discounts displayed at checkout and in the home page marquee
          </Text>
        </div>

        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchCoupons}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenAdd}
            size="large"
            className="bg-emerald-600 hover:bg-emerald-700 h-11 px-6 rounded-lg font-bold shadow-md shadow-emerald-100"
          >
            Add New Coupon
          </Button>
        </Space>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="rounded-2xl border-gray-100 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">
              <TagOutlined />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Coupons</p>
              <h3 className="text-2xl font-black text-gray-800">{coupons.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black">
              <GiftOutlined />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active Codes</p>
              <h3 className="text-2xl font-black text-gray-800">
                {coupons.filter((c) => c.isActive).length}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-gray-100 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-black">
              <PercentageOutlined />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Live in Marquee</p>
              <h3 className="text-2xl font-black text-gray-800">
                {coupons.filter((c) => c.isActive && c.showInMarquee).length}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
        <Table
          dataSource={coupons}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        title={
          <span className="text-lg font-bold">
            {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Coupon Name / Code"
            rules={[
              { required: true, message: "Please enter a coupon name / code" },
              {
                pattern: /^[A-Za-z0-9_-]+$/,
                message: "Coupon code can only contain letters, numbers, hyphens, and underscores",
              },
            ]}
          >
            <Input
              placeholder="e.g. WELCOME100, FESTIVE50"
              className="uppercase tracking-wider font-bold h-10"
            />
          </Form.Item>

          <Form.Item
            name="discountAmount"
            label="Discount Amount (₹)"
            rules={[
              { required: true, message: "Please enter discount amount" },
              {
                type: "number",
                min: 1,
                message: "Discount amount must be at least ₹1",
              },
            ]}
          >
            <InputNumber
              placeholder="e.g. 50, 100, 200"
              className="w-full h-10 flex items-center"
              prefix="₹"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="minOrderAmount"
            label="Minimum Order Value (₹) - Optional"
          >
            <InputNumber
              placeholder="0 for no minimum"
              className="w-full h-10 flex items-center"
              prefix="₹"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description / Offer Details - Optional"
          >
            <Input.TextArea
              rows={2}
              placeholder="e.g. Flat ₹100 off on all organic orders above ₹499"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-4">
            <Form.Item
              name="showInMarquee"
              label="Display in Marquee"
              valuePropName="checked"
              className="mb-0"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Active Status"
              valuePropName="checked"
              className="mb-0"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold px-6"
            >
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponAdmin;
