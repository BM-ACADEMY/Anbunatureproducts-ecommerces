import React, { useEffect, useState } from 'react';
import { Card, InputNumber, Button, Typography, Space, Divider, Row, Col, Alert, Tooltip, Tag } from 'antd';
import { SettingOutlined, TruckOutlined, SaveOutlined, InfoCircleOutlined, ReloadOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { toast } from 'sonner';
import Loading from '../components/Loading';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';

const { Title, Text, Paragraph } = Typography;

const GeneralSettingsAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState({
        shippingCharge: 0,
        freeShippingThreshold: 0
    });
    const [originalSettings, setOriginalSettings] = useState(null);

    const fetchSettings = async () => {
        try {
            setFetching(true);
            const response = await Axios(SummaryApi.getSettings);
            if (response.data.success) {
                const data = response.data.data;
                setSettings(data);
                setOriginalSettings(data);
            }
        } catch (error) {
            console.error("Error fetching settings", error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.updateSettings,
                data: settings
            });
            if (response.data.success) {
                toast.success("Settings updated successfully");
                setOriginalSettings(settings);
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    const cancelEditing = () => {
        setSettings(originalSettings);
        setIsEditing(false);
    };

    if (fetching) {
        return (
            <div className='flex items-center justify-center min-h-[400px]'>
                <Loading />
            </div>
        );
    }

    return (
        <div className='max-w-[1200px] mx-auto p-4 lg:p-8'>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <Space direction="vertical" size={0}>
                    <Title level={2} style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
                        General Settings
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
                        Configure shipping rules and global business parameters
                    </Text>
                </Space>

                <Space size="middle">
                    {!isEditing ? (
                        <Button 
                            type="primary" 
                            icon={<EditOutlined />} 
                            onClick={() => setIsEditing(true)}
                            size="large"
                            className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-lg font-bold shadow-md shadow-blue-100"
                        >
                            Edit Settings
                        </Button>
                    ) : (
                        <Space>
                            <Button 
                                onClick={cancelEditing}
                                size="large"
                                className="h-11 px-6 rounded-lg font-bold border-gray-200"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="primary" 
                                icon={loading ? <ReloadOutlined spin /> : <SaveOutlined />} 
                                onClick={handleUpdate}
                                loading={loading}
                                size="large"
                                className="bg-green-600 hover:bg-green-700 h-11 px-6 rounded-lg font-bold border-none shadow-md shadow-green-100"
                            >
                                Save Changes
                            </Button>
                        </Space>
                    )}
                </Space>
            </div>

            <Row gutter={[32, 32]}>
                {/* Left Side: Form Configuration */}
                <Col xs={24} lg={16}>
                    <Card 
                        className={`rounded-2xl border-[#e5e7eb] shadow-sm transition-all duration-300 ${!isEditing ? 'opacity-80' : 'opacity-100'}`}
                        title={
                            <Space>
                                <SettingOutlined className="text-gray-400" />
                                <span className="text-sm font-bold text-gray-800">Global Parameters</span>
                            </Space>
                        }
                        styles={{ body: { padding: '40px' } }}
                    >
                        <Row gutter={[40, 40]}>
                            <Col xs={24} md={12}>
                                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                    <Space size={8}>
                                        <Text className="font-bold text-gray-700">Shipping Charge (₹)</Text>
                                        <Tooltip title="The amount users will pay if their total is below the threshold.">
                                            <InfoCircleOutlined className="text-gray-400 cursor-help" />
                                        </Tooltip>
                                    </Space>
                                    <InputNumber
                                        disabled={!isEditing}
                                        value={settings.shippingCharge}
                                        onChange={(val) => setSettings({ ...settings, shippingCharge: val || 0 })}
                                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
                                        className="w-full h-12 flex items-center rounded-xl text-lg font-black bg-gray-50 border-[#e5e7eb]"
                                        placeholder="0"
                                        min={0}
                                    />
                                    <Text className="text-[11px] font-medium text-gray-400">Set to 0 for site-wide free shipping.</Text>
                                </Space>
                            </Col>

                            <Col xs={24} md={12}>
                                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                    <Space size={8}>
                                        <Text className="font-bold text-gray-700">Free Shipping Threshold (₹)</Text>
                                        <Tooltip title="Minimum order value to qualify for free shipping.">
                                            <InfoCircleOutlined className="text-gray-400 cursor-help" />
                                        </Tooltip>
                                    </Space>
                                    <InputNumber
                                        disabled={!isEditing}
                                        value={settings.freeShippingThreshold}
                                        onChange={(val) => setSettings({ ...settings, freeShippingThreshold: val || 0 })}
                                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/₹\s?|(,*)/g, '')}
                                        className="w-full h-12 flex items-center rounded-xl text-lg font-black bg-gray-50 border-[#e5e7eb]"
                                        placeholder="0"
                                        min={0}
                                    />
                                    <Text className="text-[11px] font-medium text-gray-400">Free shipping applies at this amount or higher.</Text>
                                </Space>
                            </Col>
                        </Row>

                        <Divider className="my-10" />

                        <div className="bg-slate-50 p-6 rounded-2xl border border-[#e5e7eb]">
                            <Space align="start" size={16}>
                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                                    <InfoCircleOutlined style={{ fontSize: '20px' }} />
                                </div>
                                <div>
                                    <Text className="font-bold text-slate-800 block mb-1">Impact Analysis</Text>
                                    <Text type="secondary" className="text-sm font-medium leading-relaxed">
                                        Changing these values will immediately recalculate the <span className="text-slate-800 font-bold">Grand Total</span> for all active carts and checkout sessions. This does not affect already placed orders.
                                    </Text>
                                </div>
                            </Space>
                        </div>
                    </Card>
                </Col>

                {/* Right Side: Summary & Logic Preview */}
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size={24} style={{ width: '100%', position: 'sticky', top: '24px' }}>
                        <Card 
                            className="rounded-2xl border-[#e5e7eb] shadow-sm overflow-hidden"
                            title={
                                <Space>
                                    <TruckOutlined className="text-blue-500" />
                                    <span className="text-sm font-black uppercase tracking-wider text-gray-500">Shipping Logic</span>
                                </Space>
                            }
                            styles={{ body: { padding: '24px' } }}
                        >
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 rounded-xl border-[#e5e7eb]">
                                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                        <Text type="secondary" className="text-[11px] font-bold uppercase tracking-widest">Current Rule</Text>
                                        <div className="text-blue-900 font-bold text-sm">
                                            {settings.shippingCharge > 0 ? (
                                                <>
                                                    Orders under <span className="text-blue-600">{DisplayPriceInRupees(settings.freeShippingThreshold)}</span> will be charged <span className="text-blue-600">{DisplayPriceInRupees(settings.shippingCharge)}</span>.
                                                </>
                                            ) : (
                                                <span className="text-green-600">Free Shipping for all orders.</span>
                                            )}
                                        </div>
                                    </Space>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-[#e5e7eb]">
                                        <Text className="font-medium text-gray-500">Shipping Cost</Text>
                                        <Tag color={settings.shippingCharge > 0 ? "blue" : "green"} className="m-0 font-bold rounded-md px-2">
                                            {settings.shippingCharge > 0 ? DisplayPriceInRupees(settings.shippingCharge) : "FREE"}
                                        </Tag>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-[#e5e7eb]">
                                        <Text className="font-medium text-gray-500">Threshold</Text>
                                        <Text className="font-bold text-gray-800">
                                            {settings.freeShippingThreshold > 0 ? DisplayPriceInRupees(settings.freeShippingThreshold) : "No Threshold"}
                                        </Text>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Text className="font-medium text-gray-500">Status</Text>
                                        <Tag icon={<CheckCircleOutlined />} color="success" className="m-0 font-bold rounded-md px-2">
                                            Live
                                        </Tag>
                                    </div>
                                </div>

                                <Alert
                                    message="Customer Insight"
                                    description={<span className="text-[12px] font-medium">Clear shipping rules increase checkout conversion by reducing friction.</span>}
                                    type="info"
                                    showIcon
                                    className="rounded-xl border-[#e5e7eb] bg-blue-50/30"
                                />
                            </div>
                        </Card>

                        <div className="px-2">
                            <Space direction="vertical" size={4}>
                                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Configuration Tool</Text>
                                <Paragraph className="text-[11px] text-gray-400 font-medium">
                                    Changes take effect immediately across the Cart and Checkout pages for all users.
                                </Paragraph>
                            </Space>
                        </div>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default GeneralSettingsAdmin;
