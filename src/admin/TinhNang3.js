import React, { useEffect, useState } from 'react';
import { addTienIch, addTienIchXungQuanh, customTienIchXungQuanh, deleteTienIch, deleteTienIchXungQuanh, fetchTienIch, fetchTienIchAll } from "../services/api";
import './TinhNang3.css'; // Import file CSS tùy chỉnh

const TinhNang3 = () => {
  const [activeTab, setActiveTab] = useState("tiennghi"); // Quản lý tab hiện tại
  const [onFix, setOnFix] = useState(null); 
  const [statusFix, setStatusFix] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationsALL, setLocationsALL] = useState([]);
  const [newLoaiTienIch, setNewLoaiTienIch] = useState("");
  const [editingTienIch, setEditingTienIch] = useState(null);

  const [newTienIch, setNewTienIch] = useState({
    tenTienIch: "",
    loai: "",
    diaChi: "",
    lat: "",
    lon: ""
  });

  // Các hàm xử lý
  const handleChinhSua = (tienIch) => {
    setStatusFix(true);
    setOnFix(tienIch.id);
    setEditingTienIch({
      tenTienIch: tienIch.tenTienIch,
      loai: tienIch.loai,
      diaChi: tienIch.diaChi || "",
      lat: tienIch.lat || "",
      lon: tienIch.lon || "",
    });
  };

  const handleCapNhatTienIchXungQuanh = async () => {
    try {
      await customTienIchXungQuanh(onFix, editingTienIch);
      setEditingTienIch(null);
      setOnFix(null);
      setStatusFix(false);
      const updatedData = await fetchTienIch();
      setLocations(updatedData.data);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      alert("Lỗi khi cập nhật tiện ích!");
    }
  };

  const handleAddTienIchXungQuanh = async () => {
    if (!newTienIch.tenTienIch.trim() || !newTienIch.loai.trim()) {
      return alert("Vui lòng nhập đầy đủ tên tiện ích và loại!");
    }

    try {
      const response = await addTienIchXungQuanh(newTienIch);
      if (response && response.data) {
        setNewTienIch({ tenTienIch: "", loai: "", diaChi: "", lat: "", lon: "" });
        const updatedData = await fetchTienIch();
        setLocations(updatedData.data);
      } else {
        console.error("❌ API không trả về dữ liệu hợp lệ");
      }
    } catch (error) {
      console.error("❌ Lỗi khi thêm tiện ích:", error);
      alert(error.message || "Lỗi khi thêm tiện ích");
    }
  };

  const handleAddTienIch = async () => {
    if (!newLoaiTienIch.trim()) return alert("Tên loại tiện ích không được để trống!");
    const response = await addTienIch({ tenTienIch: newLoaiTienIch });
    if (response.status === 201) {
      setLocationsALL(prev => [...prev, response.data.data]);
      setNewLoaiTienIch(""); 
    }
  };

  const handleXoaTienIch = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tiện ích này?")) return;
    try {
      await deleteTienIch(id);
      setLocationsALL(prev => prev.filter(tienIch => tienIch.id !== id));
    } catch (error) {
      alert("Lỗi khi xóa tiện ích");
    }
  };

  const handleXoaTienIchXungQuanh = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tiện ích này?")) return;
    try {
      await deleteTienIchXungQuanh(id);
      const updatedData = await fetchTienIch();
      setLocations(updatedData.data);
    } catch (error) {
      alert("Lỗi khi xóa tiện ích");
    }
  };

  useEffect(() => {
    const getData = async () => {
      const dataTienIch = await fetchTienIch();
      const dataTienIchAll = await fetchTienIchAll();
      setLocations(dataTienIch.data);
      setLocationsALL(dataTienIchAll)
    };
    getData();
  }, []);

  const handleHienChiTiet = (id) => {
    setStatusFix(true);
    setOnFix(id);
  };

  const handleAnChiTiet = () => {
    setStatusFix(false);
    setOnFix(null);
  };

  return (
    <div className="full-screen">
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === "tiennghi" ? "tab-button active" : "tab-button"} 
          onClick={() => setActiveTab("tiennghi")}
        >
          Tiện Ích Xung Quanh
        </button>
        <button 
          className={activeTab === "loaitiennghi" ? "tab-button active" : "tab-button"} 
          onClick={() => setActiveTab("loaitiennghi")}
        >
          Loại Tiện Ích
        </button>
      </div>

      {/* Hiển thị nội dung theo tab */}
      {activeTab === "tiennghi" && (
        <div className="tab-content">
          {/* Box 1 - Bảng Tiện Ích Xung Quanh */}
          <div className="box-1">
            <h1 className="text-center my-4">Tiện Ích Xung Quanh</h1>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Tiện Ích</th>
                  <th>Địa Chỉ</th>
                  <th>Loại</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {locations.length > 0 ? (
                  locations.map((location) => (
                    <tr key={location.id}>
                      <td>{location.id}</td>
                      <td>{location.tenTienIch}</td>
                      <td>{location.diaChi}</td>
                      <td>{location.TienIch?.tenTienIch}</td>
                      <td>
                        <button className="btn-primary" onClick={() => handleXoaTienIchXungQuanh(location.id)}>Xóa</button>
                        <button className="btn-warning" onClick={() => handleChinhSua(location)}>Sửa</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Box 2 - Form Thêm Tiện Ích */}
          <div className="box-2">
            <h3>Thêm Tiện Ích Xung Quanh</h3>
            <form>
              <label>Tên Tiện Ích</label>
              <input
                type="text"
                value={newTienIch.tenTienIch}
                onChange={(e) => setNewTienIch({ ...newTienIch, tenTienIch: e.target.value })}
              />
              <label>Loại</label>
              <input
                type="text"
                value={newTienIch.loai}
                onChange={(e) => setNewTienIch({ ...newTienIch, loai: e.target.value })}
              />
              <label>Địa Chỉ</label>
              <input
                type="text"
                value={newTienIch.diaChi}
                onChange={(e) => setNewTienIch({ ...newTienIch, diaChi: e.target.value })}
              />
              <label>Vĩ Độ</label>
              <input
                type="text"
                value={newTienIch.lat}
                onChange={(e) => setNewTienIch({ ...newTienIch, lat: e.target.value })}
              />
              <label>Kinh Độ</label>
              <input
                type="text"
                value={newTienIch.lon}
                onChange={(e) => setNewTienIch({ ...newTienIch, lon: e.target.value })}
              />
              <button type="button" onClick={handleAddTienIchXungQuanh}>Thêm</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "loaitiennghi" && (
        <div className="tab-content">
          {/* Box 3 - Bảng Loại Tiện Ích */}
          <div className="box-3">
            <h3>Danh Sách Loại Tiện Ích</h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên Loại Tiện Ích</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {locationsALL.length > 0 ? (
                  locationsALL.map((tienIch) => (
                    <tr key={tienIch.id}>
                      <td>{tienIch.id}</td>
                      <td>{tienIch.tenTienIch}</td>
                      <td>
                        <button className="btn-primary" onClick={() => handleXoaTienIch(tienIch.id)}>Xóa</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Box 4 - Form Thêm Loại Tiện Ích */}
          <div className="box-4">
            <h3>Thêm Loại Tiện Ích</h3>
            <form>
              <label>Tên Loại Tiện Ích</label>
              <input
                type="text"
                value={newLoaiTienIch}
                onChange={(e) => setNewLoaiTienIch(e.target.value)}
              />
              <button type="button" onClick={handleAddTienIch}>Thêm</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TinhNang3;
