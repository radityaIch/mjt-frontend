import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { getPermitById } from "../../api/TravelPermitAPI.js";
import { getAllSupply } from "../../api/TravelSupplyAPI.js";
import {
	Page,
	Text,
	Image,
	View,
	Document,
	StyleSheet,
	PDFViewer,
	Font,
	Svg,
	Line,
	Rect,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

Font.register({
	family: "Inter",
	src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZFhiI2B.woff2",
});

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		fontFamily: "Inter",
		paddingVertical: 32,
		paddingHorizontal: 24,
	},
	section: {
		flexGrow: 1,
	},
	header: {
		alignItems: "center",
	},
	table: {
		display: "table",
		width: "auto",
		borderStyle: "solid",
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
	tableRow: {
		margin: "auto",
		flexDirection: "row",
	},
	tableCol: {
		width: "30%",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
	},
	tableCell: {
		margin: "auto",
		marginTop: 5,
		fontSize: 10,
	},
});

export default function PermitTemplate() {
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

	const [unitList, setUnitList] = useState([]);

	const [qtyTotal, setQtyTotal] = useState(0);

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

				if (supplies) {
					const tempList = [];
					let tempQty = 0;
					const length = supplies.length > 20 ? supplies.length : 20;
					for (let index = 0; index < length; index++) {
						tempList.push(
							supplies[index] ?? {
								good_unit: null,
								qty: 0,
								keterangan: null,
							}
						);
						tempQty += tempList[index].qty ?? 0;
					}
					setQtyTotal(tempQty);
					setUnitList(tempList);
				}
			}
		};

		getPermitData(id);
	}, [history, id]);

	return (
		<PDFViewer width="100%" height="800px">
			<Document title={`Surat Jalan ${permit.no_do}`}>
				<Page size="A4" style={styles.page}>
					<View
						wrap
						fixed
						style={{
							...styles.section,
							flexDirection: "row",
							maxHeight: 75,
						}}
					>
						<View
							style={{
								maxWidth: 66,
								maxHeight: 66,
							}}
						>
							<Image src="/icon-dark.png" style={{ width: 66, height: 66 }} />
						</View>
						<View
							style={{
								...styles.header,
								margin: "0 10pt 0 10pt",
								textAlign: "center",
								width: "100%",
								maxWidth: 362,
							}}
						>
							<Text style={{ color: "#478F9B", fontSize: 14, fontWeight: 600 }}>
								PT MEGA JAYA TRANSPORTINDO
							</Text>
							<Text
								style={{ fontSize: 10, fontWeight: 600, marginVertical: 2 }}
							>
								Jasa Pengiriman / Ekspedisi
							</Text>
							<Text
								style={{ fontSize: 8, fontWeight: "thin", marginVertical: 1 }}
							>
								Ruko Simpony blok HX 2 No 58 Kota Harapan Indah, Kec.
								Tasikmalaya
							</Text>
							<Text
								style={{ fontSize: 8, fontWeight: "thin", marginVertical: 1 }}
							>
								Kota Bekasi, Jawa Barat, 17131
							</Text>
							<Text
								style={{ fontSize: 8, fontWeight: "thin", marginVertical: 2 }}
							>
								Telepon : +6281514448909 / +6281238799269
							</Text>
						</View>
						<View>
							<Text style={{ fontSize: 10, fontWeight: 600 }}>Nomor SJ :</Text>
							<Text style={{ fontSize: 10, fontWeight: 600, color: "#478F9B" }}>
								{permit.no_do}
							</Text>
						</View>
					</View>

					<View fixed style={{ flexDirection: "row", marginBottom: 20 }}>
						<Svg width="296" height="10">
							<Line
								x1="0"
								x2="296"
								y1="8"
								y2="8"
								strokeWidth={3}
								stroke="#4066E3"
							></Line>
						</Svg>

						<Text
							style={{ fontWeight: 600, fontSize: 14, marginHorizontal: 16 }}
						>
							Surat Jalan
						</Text>

						<Svg width="136" height="10">
							<Line
								x1="0"
								x2="136"
								y1="8"
								y2="8"
								strokeWidth={3}
								stroke="#4066E3"
							></Line>
						</Svg>
					</View>

					<View style={{ flexDirection: "row", marginBottom: 20 }}>
						<View style={{ flexDirection: "column", width: "50%" }}>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								No. DO :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.no_do}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Pengirim :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.pengirim}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Alamat Muat :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.alamat_muat}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Alamat Kirim :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.alamat_kirim}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Telp :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.no_telp}
								</Text>
							</Text>
						</View>

						<View style={{ flexDirection: "column", width: "50%" }}>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Tanggal SJ :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{dayjs(new Date()).format("DD/MM/YYYY")}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								NoPol :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.armada.nopol}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Driver :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.armada.driver}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Unit :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.armada.unit}
								</Text>
							</Text>
							<Text style={{ fontSize: 10, marginVertical: 5 }}>
								Pengiriman :{" "}
								<Text style={{ textDecoration: "underline" }}>
									{permit.armada.pengiriman}
								</Text>
							</Text>
						</View>
					</View>

					<View style={{ ...styles.table, marginBottom: 60 }}>
						<View style={styles.tableRow}>
							<View style={{ ...styles.tableCol, width: "10%" }}>
								<Text style={styles.tableCell}>No</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>Nama Barang</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>Qty</Text>
							</View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}>Keterangan</Text>
							</View>
						</View>
						{unitList.map((data, index) => (
							<View style={styles.tableRow} key={index}>
								<View style={{ ...styles.tableCol, width: "10%" }}>
									<Text style={styles.tableCell}>{index + 1}</Text>
								</View>
								<View style={styles.tableCol}>
									<Text style={styles.tableCell}>{data.good_unit}</Text>
								</View>
								<View style={styles.tableCol}>
									<Text style={styles.tableCell}>
										{data.qty !== 0 ? data.qty : ""}
									</Text>
								</View>
								<View style={styles.tableCol}>
									<Text style={styles.tableCell}>{data.keterangan}</Text>
								</View>
							</View>
						))}
						<View style={styles.tableRow}>
							<View style={{ ...styles.tableCol, width: "10%" }}>
								<Text style={styles.tableCell}>Total</Text>
							</View>
							<View style={styles.tableCol}></View>
							<View style={styles.tableCol}>
								<Text style={styles.tableCell}></Text>
							</View>
							<View style={styles.tableCol}></View>
						</View>
					</View>

					<View
						fixed
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							height: 100,
							paddingHorizontal: 10,
						}}
					>
						<View style={{ flexBasis: 250 }}>
							<Text style={{ fontSize: 12, marginBottom: 8 }}>Remark</Text>
							<Svg viewBox="0 0 320 100">
								<Rect
									rx="15"
									ry="15"
									width="320"
									height="100"
									stroke="#333333"
								/>
							</Svg>
						</View>
						<Text
							style={{
								fontSize: 10,
								marginTop: 80,
								textDecoration: "underline",
							}}
						>
							DRIVER
						</Text>
						<Text
							style={{
								fontSize: 10,
								marginTop: 80,
								textDecoration: "underline",
							}}
						>
							PENERIMA
						</Text>
					</View>

					<Svg fixed width="548" height="10">
						<Line
							x1="0"
							x2="548"
							y1="8"
							y2="8"
							strokeWidth={3}
							stroke="#4066E3"
						></Line>
					</Svg>
				</Page>
			</Document>
		</PDFViewer>
	);
}
