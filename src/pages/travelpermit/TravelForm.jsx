import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
	notificationOptions,
	setFormData,
} from "../../components/utils/utils.js";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import Swal from "sweetalert2";
import {
	Col,
	Row,
	Button,
	FormGroup,
	FormText,
	Input,
	InputGroup,
	InputGroupText,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import s from "../components/Tables.module.scss";
import {
	addPermit,
	deletePermit,
	getAllPermit,
	getPermitById,
	updatePermit,
} from "../../api/TravelPermitAPI.js";

import {
	addSupply,
	deleteSupply,
	getAllSupply,
} from "../../api/TravelSupplyAPI.js";
import { addTracking } from "../../api/TravelTrackingAPI.js";

const TravelForm = (props) => {
	const history = useHistory();
	const { id } = useParams();

	const [goods, setGoods] = useState([
		{
			good_unit: "",
			qty: 0,
			keterangan: "",
		},
	]);

	const [permit, setPermit] = useState({
		no_do: "",
		pengirim: "",
		alamat_muat: "",
		alamat_kirim: "",
		no_telp: "",
		armada: {
			nopol: "",
			driver: "",
			unit: "",
			pengiriman: "",
			harga_beli: 0,
			harga_jual: 0,
		},
		barang: goods,
	});

	const changeInput = (event) => {
		setPermit({ ...permit, [event.target.name]: event.target.value });
	};

	const changeArmadaInput = (event) => {
		setPermit({
			...permit,
			armada: { ...permit.armada, [event.target.name]: event.target.value },
		});
	};

	const cancelPermit = (id) => {
		Swal.fire({
			title: "Membatalkan Pengiriman",
			html: "Mohon tunggu . . .",
			padding: "30px",
			didOpen: async () => {
				Swal.showLoading();
				const res = await deletePermit(id);
				if (res.status === 200) {
					Swal.close();
					history.push("/dashboard/surat-jalan/dalam-perjalanan");
					toast(
						<Notification
							type="success"
							message="Surat berhasil dibatalkan"
							withIcon
						/>,
						notificationOptions
					);
				}
			},
		});
	};

	const onSubmitHandler = (event) => {
		event.preventDefault();

		Swal.fire({
			title: "Menyimpan Informasi Surat",
			html: "Mohon tunggu, sedang menyimpan informasi surat",
			padding: "30px",
			didOpen: async () => {
				Swal.showLoading();
				// console.log(permit);
				const cleanData = {
					no_do: permit.no_do,
					pengirim: permit.pengirim,
					alamat_muat: permit.alamat_muat,
					alamat_kirim: permit.alamat_kirim,
					no_telp: permit.no_telp,
					nopol: permit.armada.nopol,
					driver: permit.armada.driver,
					unit: permit.armada.unit,
					pengiriman: permit.armada.pengiriman,
					harga_jual: permit.armada.harga_jual,
					harga_beli: permit.armada.harga_beli,
					status_pengiriman: "Dalam Perjalanan",
				};

				const payload = setFormData(cleanData);

				if (!props.isEdit) {
					await addPermit(payload).then(async (res) => {
						if (res.status === 200 || res.status === 201) {
							const allpermit = await getAllPermit();
							const newID = allpermit[0].id;

							Promise.all(
								goods.map(async (brg) => {
									const payload = setFormData({
										travel_permit_id: newID,
										barang: brg.good_unit,
										qty: brg.qty,
										keterangan: brg.keterangan,
									});

									addSupply(payload).then(async () => {
										const payload = setFormData({
											travel_permit_id: newID,
											keterangan: "Masih Dalam Perjalanan",
											kendala: "Tidak Ada",
										});

										await addTracking(payload);
									});
								})
							).then(() => {
								Swal.close();
								history.push("/dashboard/surat-jalan/dalam-perjalanan");
								toast(
									<Notification
										type="success"
										message="Surat baru berhasil ditambahkan!"
										withIcon
									/>,
									notificationOptions
								);
							});
						}
					});
				} else {
					await updatePermit(id, payload).then(async (res) => {
						if (res.status === 200 || res.status === 201) {
							const newID = id;

							await deleteSupply(newID).then(async (res) => {
								if (res.status === 200 || res.status === 201) {									
									Promise.all(
										goods.map(async (brg) => {
											const payload = setFormData({
												travel_permit_id: newID,
												barang: brg.good_unit,
												qty: brg.qty,
												keterangan: brg.keterangan,
											});
											addSupply(payload);
											/*.then(async () => {
												const payload = setFormData({
													travel_permit_id: newID,
													keterangan: "Masih Dalam Perjalanan",
													kendala: "Tidak Ada",
												});

												// await addTracking(payload);
											});*/
										})
									).then(() => {
										Swal.close();
										history.push("/dashboard/surat-jalan/dalam-perjalanan");
										toast(
											<Notification
												type="success"
												message="Surat berhasil diupdate!"
												withIcon
											/>,
											notificationOptions
										);
									});
								}
							});
						}
					});
				}
			},
		});
	};

	const deleteByIndex = useCallback(
		(i) => {
			const newData = goods.filter((g, index) => index !== i);
			setGoods(newData);
		},
		[goods]
	);

	const addGoodies = () => {
		const newData = {
			good_unit: "",
			qty: 0,
			keterangan: "",
		};

		setGoods((oldData) => [...oldData, newData]);
		setPermit({ ...permit, barang: goods });
	};

	useEffect(() => {
		const getPermitData = async (id) => {
			const permitData = await getPermitById(id);
			if (permitData.status) {
				history.push("/dashboard/surat-jalan/dalam-perjalanan");
			} else {
				const supplyData = await getAllSupply(id);
				const supplies = supplyData.map((supply) => ({
					good_unit: supply.barang,
					qty: supply.qty,
					keterangan: supply.keterangan,
				}));

				setGoods(supplies);

				const permitEdit = {
					no_do: permitData.no_do,
					pengirim: permitData.pengirim,
					alamat_muat: permitData.alamat_muat,
					alamat_kirim: permitData.alamat_kirim,
					no_telp: permitData.no_telp,
					armada: {
						nopol: permitData.nopol,
						driver: permitData.driver,
						unit: permitData.unit,
						pengiriman: permitData.pengiriman,
						harga_beli: permitData.harga_beli,
						harga_jual: permitData.harga_jual,
					},
					barang: supplies,
				};
				setPermit(permitEdit);
			}
		};

		if (id) {
			getPermitData(id);
		}		
	}, [history, id]);

	return (
		<div>
			<Row>
				<Col>
					<Row className="mb-4">
						<Col>
							<Widget>
								<div className={s.tableTitle}>
									<h2 className="headline-2">
										{props.isEdit ? "Detail Surat Jalan" : "Tambah Surat Jalan"}
									</h2>

									{props.isEdit ? (
										<div className="d-flex">
											<Link to={`/print/surat-jalan/${id}`} target="_blank">
												<Button className="rounded-pill mr-3" color="primary">
													Export ke PDF
												</Button>
											</Link>
										</div>
									) : (
										""
									)}
								</div>

								<form
									onSubmit={(e) => onSubmitHandler(e)}
									encType="multipart/form-data"
									method="POST"
								>
									<div className="px-4">
										<FormGroup className="my-3">
											<FormText className="mb-2">No. Do</FormText>
											<Input
												id="no-do"
												name="no_do"
												className="input-transparent py-4 pl-3"
												type="text"
												required
												value={permit?.no_do}
												onChange={(e) => changeInput(e)}
											/>
										</FormGroup>

										<FormGroup className="my-3">
											<FormText className="mb-2">Pengirim</FormText>
											<Input
												id="pengirim"
												name="pengirim"
												className="input-transparent py-4 pl-3"
												type="text"
												required
												value={permit?.pengirim}
												onChange={(e) => changeInput(e)}
											/>
										</FormGroup>

										<FormGroup className="my-3">
											<Row>
												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">Alamat Muat</FormText>
														<Input
															id="alamat-muat"
															name="alamat_muat"
															className="input-transparent py-4 pl-3"
															type="text"
															required
															value={permit?.alamat_muat}
															onChange={(e) => changeInput(e)}
														/>
													</FormGroup>
												</Col>

												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">Alamat Kirim</FormText>
														<Input
															id="alamat-kirim"
															name="alamat_kirim"
															className="input-transparent py-4 pl-3"
															type="text"
															required
															value={permit?.alamat_kirim}
															onChange={(e) => changeInput(e)}
														/>
													</FormGroup>
												</Col>
											</Row>
										</FormGroup>

										<FormGroup className="my-3">
											<FormText className="mb-2">No. Telp</FormText>
											<Input
												id="no-telp"
												name="no_telp"
												className="input-transparent py-4 pl-3"
												type="text"
												required
												value={permit?.no_telp}
												onChange={(e) => changeInput(e)}
											/>
										</FormGroup>

										{/* Armada Form */}
										<h6 className="mt-5 mb-3">Keterangan Armada</h6>
										<FormGroup className="my-3">
											<Row>
												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">
															Nopol / No. Plat
														</FormText>
														<Input
															id="nopol"
															name="nopol"
															className="input-transparent py-4 pl-3"
															type="text"
															required
															value={permit?.armada?.nopol}
															onChange={(e) => changeArmadaInput(e)}
														/>
													</FormGroup>
												</Col>

												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">Driver</FormText>
														<Input
															id="driver"
															name="driver"
															className="input-transparent py-4 pl-3"
															type="text"
															required
															value={permit?.armada?.driver}
															onChange={(e) => changeArmadaInput(e)}
														/>
													</FormGroup>
												</Col>
											</Row>
										</FormGroup>

										<FormGroup className="my-3">
											<Row>
												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">Unit</FormText>
														<Input
															id="unit"
															name="unit"
															className="input-transparent py-4 pl-3"
															type="text"
															required
															value={permit?.armada?.unit}
															onChange={(e) => changeArmadaInput(e)}
														/>
													</FormGroup>
												</Col>

												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">Pengiriman</FormText>
														<Input
															id="no-do"
															name="pengiriman"
															className="input-transparent py-4 pl-3"
															type="text"
															required
															value={permit?.armada?.pengiriman}
															onChange={(e) => changeArmadaInput(e)}
														/>
													</FormGroup>
												</Col>
											</Row>
										</FormGroup>

										<FormGroup className="my-3">
											<Row>
												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">Harga Jual</FormText>
														<InputGroup>
															<InputGroupText>Rp.</InputGroupText>
															<Input
																id="harga-jual"
																name="harga_jual"
																className="input-transparent py-4 pl-3"
																type="number"
																required
																value={permit?.armada?.harga_jual}
																onChange={(e) => changeArmadaInput(e)}
															/>
														</InputGroup>
													</FormGroup>
												</Col>

												<Col md="6">
													<FormGroup className="my-3">
														<FormText className="mb-2">
															Harga Beli / Uang Jalan
														</FormText>
														<InputGroup>
															<InputGroupText>Rp.</InputGroupText>
															<Input
																id="harga-beli"
																name="harga_beli"
																className="input-transparent py-4 pl-3"
																type="number"
																required
																value={permit?.armada?.harga_beli}
																onChange={(e) => changeArmadaInput(e)}
															/>
														</InputGroup>
													</FormGroup>
												</Col>
											</Row>
										</FormGroup>

										{/* Goods Form */}
										<h6 className="mt-5 mb-3">Keterangan Barang</h6>
										{goods
											? goods.map((good, index) => (
													<FormGroup className="my-3" key={index}>
														<Row>
															<Col md="4">
																<FormGroup className="my-3">
																	<FormText className="mb-2">Unit</FormText>
																	<Input
																		id="good-unit"
																		name="good_unit"
																		className="input-transparent py-4 pl-3"
																		type="text"
																		required
																		onChange={(e) => {
																			const newData = goods.filter(
																				(good, i) => {
																					if (index === i) {
																						return (good.good_unit =
																							e.target.value);
																					}
																					return good;
																				}
																			);

																			setGoods(newData);
																		}}
																		value={good?.good_unit}
																	/>
																</FormGroup>
															</Col>

															<Col md="2">
																<FormGroup className="my-3">
																	<FormText className="mb-2">Qty</FormText>
																	<Input
																		id="qty"
																		name="qty"
																		className="input-transparent py-4 pl-3"
																		type="number"
																		required
																		onChange={(e) => {
																			const newData = goods.filter(
																				(good, i) => {
																					if (index === i) {
																						return (good.qty = e.target.value);
																					}
																					return good;
																				}
																			);

																			setGoods(newData);
																		}}
																		value={good?.qty}
																	/>
																</FormGroup>
															</Col>

															<Col md="5">
																<FormGroup className="my-3">
																	<FormText className="mb-2">
																		Keterangan
																	</FormText>
																	<Input
																		id="keterangan"
																		name="keterangan"
																		className="input-transparent py-4 pl-3"
																		type="text"
																		required
																		onChange={(e) => {
																			const newData = goods.filter(
																				(good, i) => {
																					if (index === i) {
																						return (good.keterangan =
																							e.target.value);
																					}
																					return good;
																				}
																			);

																			setGoods(newData);
																		}}
																		value={good?.keterangan}
																	/>
																</FormGroup>
															</Col>

															<Col
																className="mt-4 d-flex align-items-center"
																md="1"
															>
																<Button
																	type="button"
																	onClick={() => deleteByIndex(index)}
																	className="w-100 px-0"
																	size="lg"
																	color="danger"
																	disabled={goods.length === 1}
																>
																	X
																</Button>
															</Col>
														</Row>
													</FormGroup>
											  ))
											: ""}

										<Button
											onClick={() => addGoodies()}
											type="button"
											className="d-flex my-5"
											color="primary"
											size="lg"
										>
											Tambah Barang
										</Button>

										<div className="mb-5 d-flex justify-content-end">
											{props.isEdit ? (
												<Button
													type="button"
													className="mr-auto"
													color="danger"
													onClick={() => cancelPermit(id)}
												>
													Batalkan Pengiriman
												</Button>
											) : (
												""
											)}

											<Button type="reset" color="danger" className="mr-2">
												Batal
											</Button>
											<Button type="submit" color="success">
												{props.isEdit ? "Simpan Perubahan" : "Simpan"}
											</Button>
										</div>
									</div>
								</form>
							</Widget>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
};

export default TravelForm;
