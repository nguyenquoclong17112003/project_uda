import React, { useEffect, useState } from 'react';
import { deleteNhaTro, fetchLocations, handleDuyetAPI } from "../services/api";
import Chinhsuachitiet from "./chinhsuachitiet";
import "./TinhNang1.css";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ".000.000";
};

const TinhNang1 = () => {
  const [locations, setLocations] = useState([]);
  const [onfix, setOnFix] = useState(null);
  const [statusFix, setStatusFix] = useState(false);
  const selectedLocation = locations.find((location) => location.id === onfix);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchLocations();
      setLocations(data);
    };
    getData();
  }, []);

  const handleDuyet = async (id) => {
    try {
      const response = await handleDuyetAPI(id);
      if (response && response.status === 200) {
        const updatedLocations = await fetchLocations();
        setLocations(updatedLocations);
      }
    } catch (error) {
      console.error("Lỗi khi duyệt hoặc hủy duyệt nhà trọ:", error);
    }
  };

  const xoaNhaTro = async (id) => {
    try {
      const response = await deleteNhaTro(id);
      if (response && response.status === 200) {
        setLocations(prevLocations => prevLocations.filter(location => location.id !== id));
      } else {
        alert("Lỗi: Xóa không thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  const handleHienChiTiet = (id) => {
    setStatusFix(true);
    setOnFix(id);
  };

  const handleAnChiTiet = () => {
    setStatusFix(false);
    setOnFix(null);
  };

  return (
    <div className="uda-tinhnang1">
      <h1 className="uda-tinhnang1-title">DANH SÁCH NHÀ TRỌ</h1>
      <div className="uda-tinhnang1-table-wrapper">
        <table className="uda-tinhnang1-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Nhà Trọ</th>
              <th>Địa Chỉ</th>
              <th>Chủ Nhà</th>
              <th>SĐT</th>
              <th>Giá Min</th>
              <th>Giá Max</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {statusFix && selectedLocation ? (
              <tr>
                <td>{selectedLocation.id}</td>
                <td>{selectedLocation.tenNhaTro}</td>
                <td>{selectedLocation.diaChi}</td>
                <td>{selectedLocation.tenChuNha}</td>
                <td>{selectedLocation.sdt}</td>
                <td>{formatCurrency(selectedLocation.giaMin)}</td>
                <td>{formatCurrency(selectedLocation.giaMax)}</td>
                <td>
                  <button
                    className={`uda-tinhnang1-button ${selectedLocation.trangThai === 0 ? "uda-success" : "uda-danger"}`}
                    onClick={() => handleDuyet(selectedLocation.id)}
                  >
                    {selectedLocation.trangThai === 0 ? "Duyệt" : "Hủy duyệt"}
                  </button>
                </td>
                <td>
                  <button className="uda-tinhnang1-button uda-danger" onClick={handleAnChiTiet}>Hủy sửa</button>
                </td>
              </tr>
            ) : (
              locations.length > 0 ? (
                locations.map((location) => (
                  <tr key={location.id}>
                    <td>{location.id}</td>
                    <td>{location.tenNhaTro}</td>
                    <td>{location.diaChi}</td>
                    <td>{location.tenChuNha}</td>
                    <td>{location.sdt}</td>
                    <td>{formatCurrency(location.giaMin)}</td>
                    <td>{formatCurrency(location.giaMax)}</td>
                    <td>
                      <button
                        className={`uda-tinhnang1-button ${location.trangThai === 0 ? "uda-success" : "uda-danger"}`}
                        onClick={() => handleDuyet(location.id)}
                      >
                        {location.trangThai === 0 ? "Duyệt" : "Bỏ duyệt"}
                      </button>
                    </td>
                    <td>
                      <button className="uda-tinhnang1-button uda-edit" onClick={() => handleHienChiTiet(location.id)}>
                        Sửa
                      </button>
                      <button className="uda-tinhnang1-button uda-delete" onClick={() => xoaNhaTro(location.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="uda-tinhnang1-empty">Không có dữ liệu nhà trọ</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      {statusFix && <Chinhsuachitiet onFix={onfix} />}
    </div>
  );
};

export default TinhNang1;
