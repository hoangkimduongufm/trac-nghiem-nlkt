// Full dataset of 115 questions with updated accurate answers and instant explanations
const quizData = [
            {
                id: 1,
                question: "Phát biểu nào sau đây không đúng về các loại hạch toán?",
                options: [
                    "Đối tượng nghiên cứu của hạch toán nghiệp vụ là các nghiệp vụ kinh tế, kỹ thuật cụ thể.",
                    "Hạch toán thống kê là hạch toán không có hệ thống phương pháp riêng.",
                    "Hạch toán kế toán nhằm cung cấp thông tin kinh tế, tài chính của các tổ chức.",
                    "Hạch toán kế toán còn được gọi tắt là kế toán."
                ],
                correct: 1,
                explanation: "Hạch toán thống kê có hệ thống phương pháp riêng (như điều tra thống kê, phân tổ thống kê, số tương đối, số tuyệt đối...)."
            },
            {
                id: 2,
                question: "Các bước tuần tự cần thực hiện để có được thông tin cung cấp cho các đối tượng sử dụng thông tin thường bao gồm:",
                options: [
                    "Quan sát – Đo lường – Tính toán – Ghi chép",
                    "Đo lường – Quan sát – Tính toán – Ghi chép",
                    "Ghi chép – Tính toán – Đo lường – Quan sát",
                    "Tất cả các câu đều sai"
                ],
                correct: 0,
                explanation: "Trình tự chuẩn của quá trình thu nhận thông tin kế toán bắt đầu từ quan sát, đo lường, tính toán rồi đến ghi chép."
            },
            {
                id: 3,
                question: "Ba loại thước đo chủ yếu được sử dụng để đo lường mức độ hao phí của các đối tượng khi tham gia vào các quá trình kinh tế bao gồm:",
                options: [
                    "Hiện vật, Giá trị, Thời gian lao động",
                    "Trọng lượng, Thể tích, Diện tích",
                    "Giờ, Ngày, Tuần",
                    "Tất cả các câu đều sai"
                ],
                correct: 0,
                explanation: "Trong hạch toán nói chung và kế toán nói riêng, 3 loại thước đo chủ yếu là: thước đo hiện vật, thước đo giá trị và thước đo thời gian lao động."
            },
            {
                id: 4,
                question: "Phát biểu nào dưới đây không đúng về kế toán:",
                options: [
                    "Kế toán tổng hợp cung cấp thông tin tổng quát về các đối tượng kế toán",
                    "Kế toán chi tiết chỉ sử dụng cả 3 loại thước đo",
                    "Kế toán chi tiết cung cấp thông tin chi tiết về các đối tượng kế toán",
                    "Kế toán tổng hợp chỉ sử dụng cả 3 loại thước đo"
                ],
                correct: 3,
                explanation: "Kế toán tổng hợp: Phản ánh và ghi chép thông tin ở dạng tổng quát trên các tài khoản cấp 1 (Sổ Cái) và chỉ sử dụng 1 loại thước đo duy nhất là thước đo tiền tệ (giá trị)"
            },
            {
                id: 5,
                question: "Các đặc điểm nào sau đây không được dùng để mô tả tài sản",
                options: [
                    "Có thể thu được lợi ích kinh tế trong tương lai",
                    "Là nguồn lực do doanh nghiệp kiểm soát",
                    "Là nguồn lực do doanh nghiệp sở hữu",
                    "Được hình thành từ các giao dịch và các sự kiện đã qua."
                ],
                correct: 2,
                explanation: "Tài sản không nhất thiết phải do doanh nghiệp sở hữu (ví dụ tài sản thuê tài chính), mà cốt lõi là do doanh nghiệp kiểm soát và thu được lợi ích kinh tế từ đó."
            },
            {
                id: 6,
                question: "Hai chức năng chủ yếu của kế toán là:",
                options: [
                    "Đánh giá và thanh tra",
                    "Thông tin và giám đốc",
                    "Kiểm soát và thanh tra",
                    "Phân tích và đánh giá"
                ],
                correct: 1,
                explanation: "Hai chức năng cơ bản và quan trọng nhất của kế toán là chức năng thông tin (cung cấp số liệu) và chức năng kiểm kiểm tra (giám đốc tình hình hoạt động)."
            },
            {
                id: 7,
                question: "Các đặc điểm nào dưới đây không được dùng để mô tả nợ phải trả",
                options: [
                    "Là nghĩa vụ hiện tại của doanh nghiệp",
                    "Phát sinh từ các giao dịch và sự kiện đã qua",
                    "Phải thanh toán từ các nguồn lực của mình",
                    "Việc thanh toán phải được thực hiện bằng cách cung cấp dịch vụ"
                ],
                correct: 3,
                explanation: "Nợ phải trả có thể được thanh toán bằng tiền, tài sản khác, chuyển đổi thành vốn hoặc cung cấp dịch vụ, nên việc giới hạn bắt buộc phải bằng cung cấp dịch vụ là không chính xác."
            },
            {
                id: 8,
                question: "Phát biểu nào dưới đây không đúng về vốn chủ sở hữu",
                options: [
                    "Là số vốn của chủ sở hữu mà doanh nghiệp không phải cam kết thanh toán",
                    "Là số chênh lệch giữa giá trị tài sản của doanh nghiệp trừ đi nợ phải trả",
                    "Là yếu tố để đánh giá tình hình tài chính của doanh nghiệp",
                    "Là yếu tố để đánh giá tình hình kinh doanh của doanh nghiệp"
                ],
                correct: 3,
                explanation: "Tình hình kinh doanh (kết quả hoạt động) được đánh giá qua doanh thu, chi phí và lợi nhuận, trong khi vốn chủ sở hữu phản ánh tình hình tài chính."
            },
            {
                id: 9,
                question: "Phát biểu nào dưới đây không đúng về doanh thu",
                options: [
                    "Là tổng giá trị các lợi ích kinh tế doanh nghiệp thu được trong tương lai",
                    "Phát sinh từ các hoạt động sản xuất, kinh doanh thông thường của doanh nghiệp",
                    "Góp phần làm tăng vốn chủ sở hữu.",
                    "Là yếu tố để đánh giá tình hình kinh doanh của doanh nghiệp"
                ],
                correct: 0,
                explanation: "Doanh thu là tổng giá trị các lợi ích kinh tế doanh nghiệp đã thu được hoặc sẽ thu được trong kỳ, làm tăng vốn chủ sở hữu (không phải chỉ thu được trong tương lai)."
            },
            {
                id: 10,
                question: "Phát biểu nào dưới đây không đúng về chi phí",
                options: [
                    "Là tổng giá trị các khoản làm giảm lợi ích kinh tế trong kỳ kế toán",
                    "Làm giảm vốn chủ sở hữu",
                    "Không bao gồm khoản phân phối cho cổ đông hoặc chủ sở hữu.",
                    "Là yếu tố để đánh giá tình hình tài chính của doanh nghiệp"
                ],
                correct: 3,
                explanation: "Chi phí cùng với doanh thu là yếu tố phản ánh kết quả kinh doanh (tình hình kinh doanh), chứ không phải phản ánh tình hình tài chính trực tiếp như tài sản/nợ."
            },
            {
                id: 11,
                question: "Nếu công ty Hải My có tổng tài sản 500 triệu đồng, tổng vốn chủ sở hữu 300 triệu đồng thì tổng nợ phải trả của công ty Hải My sẽ là:",
                options: [
                    "200 triệu đồng",
                    "800 triệu đồng",
                    "500 triệu đồng",
                    "Tất cả các câu đều sai"
                ],
                correct: 0,
                explanation: "Theo phương trình kế toán: Tài sản = Nợ phải trả + Vốn chủ sở hữu => Nợ phải trả = 500 - 300 = 200 triệu đồng."
            },
            {
                id: 12,
                question: "Trong năm N, tại công ty Hồng Hà, nếu tổng tài sản tăng lên 500 triệu đồng và tổng nợ phải trả tăng lên 300 triệu đồng thì tổng vốn chủ sở hữu:",
                options: [
                    "Tăng lên 200 triệu",
                    "Giảm đi 200 triệu",
                    "Tăng lên 800 triệu",
                    "Giảm đi 800 triệu"
                ],
                correct: 0,
                explanation: "ΔVốn chủ sở hữu = ΔTài sản - ΔNợ phải trả = 500 - 300 = tăng lên 200 triệu đồng."
            },
            {
                id: 13,
                question: "Phát biểu nào dưới đây mô tả không đúng về Luật kế toán?",
                options: [
                    "Luật kế toán là văn bản pháp lý cao nhất về kế toán hiện nay.",
                    "Luật kế toán quy định những vấn đề mang tính nguyên tắc và làm cơ sở nền tảng để thực hiện công tác kế toán tài chính tại các đơn vị.",
                    "Luật Kế toán quy định những vấn đề mang tính nguyên tắc và làm cơ sở nền tảng để xây dựng Chuẩn mực kế toán và Chế độ hướng dẫn kế toán.",
                    "Tất cả các câu trên đều đúng"
                ],
                correct: 1,
                explanation: "Luật Kế toán quy định những vấn đề mang tính nguyên tắc làm cơ sở nền tảng để xây dựng Chuẩn mực kế toán và Chế độ kế toán"
            },
            {
                id: 14,
                question: "Phát biểu nào sau đây mô tả không đúng về Chuẩn mực kế toán?",
                options: [
                    "Chuẩn mực kế toán gồm các quy định cụ thể về chứng từ kế toán, tài khoản kế toán và sổ kế toán.",
                    "Chuẩn mực kế toán gồm những nguyên tắc và phương pháp kế toán cơ bản để ghi sổ kế toán và lập báo cáo tài chính.",
                    "Chuẩn mực kế toán Việt Nam do Bộ Tài chính ban hành.",
                    "Chuẩn mực kế toán Việt Nam được xây dựng trên cơ sở chuẩn mực quốc tế về kế toán và theo quy định của Luật kế toán."
                ],
                correct: 0,
                explanation: "Quy định cụ thể về chứng từ, tài khoản và sổ kế toán thuộc phạm vi của 'Chế độ kế toán', không phải chuẩn mực kế toán."
            },
            {
                id: 15,
                question: "Phát biểu nào sau đây mô tả không đúng về chế độ kế toán?",
                options: [
                    "Chế độ kế toán quy định và hướng dẫn các vấn đề cụ thể về nghiệp vụ kế toán, phương pháp kế toán, chứng từ kế toán, tài khoản kế toán, sổ kế toán, báo cáo kế toán.",
                    "Tất cả các doanh nghiệp, hoạt động trong các ngành nghề khác nhau đều phải áp dụng cùng một chế độ kế toán là chế độ kế toán doanh nghiệp.",
                    "Thông thường, Chế độ kế toán do Bộ Tài chính ban hành.",
                    "Chế độ kế toán được xây dựng trên cơ sở chuẩn mực kế toán Việt Nam."
                ],
                correct: 1,
                explanation: "Mỗi loại hình doanh nghiệp, lĩnh vực đặc thù (như ngân hàng, bảo hiểm, chứng khoán, DNNV...) sẽ áp dụng chế độ kế toán phù hợp riêng, không bắt buộc tất cả dùng chung một chế độ."
            },
            {
                id: 16,
                question: "Nếu “Kế toán DNTN Tân Phong ghi nhận số tiền chi dùng cá nhân của chủ doanh nghiệp vào chi phí của doanh nghiệp” thì khái niệm kế toán bị vi phạm là:",
                options: [
                    "Khái niệm kỳ kế toán",
                    "Khái niệm thước đo tiền tệ",
                    "Khái niệm tổ chức kinh doanh.",
                    "Tất cả các câu đều sai"
                ],
                correct: 2,
                explanation: "Khái niệm thực thể kinh doanh (tổ chức kinh doanh) yêu cầu phải tách biệt tài sản và chi phí của doanh nghiệp với cá nhân chủ sở hữu."
            },
            {
                id: 17,
                question: "Mục tiêu chủ yếu của nguyên tắc phù hợp là:",
                options: [
                    "Cung cấp thông tin kịp thời đến các đối tượng sử dụng thông tin ở bên ngoài doanh nghiệp.",
                    "Ghi nhận chi phí cùng kỳ với doanh thu do nó tạo ra.",
                    "Không đánh giá cao hơn giá trị của các tài sản.",
                    "Tất cả các câu đều đúng."
                ],
                correct: 1,
                explanation: "Nguyên tắc phù hợp yêu cầu khi ghi nhận doanh thu thì phải ghi nhận khoản chi phí tương ứng có liên quan trực tiếp để tạo ra doanh thu đó trong cùng kỳ."
            },
            {
                id: 18,
                question: "Nếu “Công ty Tuấn Minh phản ánh máy móc thiết bị theo giá thị trường trên báo cáo tài chính” thì nguyên tắc kế toán bị vi phạm là:",
                options: [
                    "Nguyên tắc giá gốc.",
                    "Nguyên tắc cơ sở dồn tích",
                    "Nguyên tắc phù hợp",
                    "Nguyên tắc thận trọng."
                ],
                correct: 0,
                explanation: "Nguyên tắc giá gốc yêu cầu tài sản phải được ghi nhận theo giá trị thực tế lúc mua/hình thành, không tự ý thay đổi theo giá thị trường."
            },
            {
                id: 19,
                question: "Nếu “Tháng 1, Công ty Thịnh Khang chuyển khoản 60 triệu đồng trả tiền thuê văn phòng 6 tháng đầu năm và ghi nhận toàn bộ số tiền này vào chi phí tháng 1” thì nguyên tắc kế toán bị vi phạm là:",
                options: [
                    "Nguyên tắc giá gốc",
                    "Nguyên tắc phù hợp",
                    "Nguyên tắc hoạt động liên tục",
                    "Nguyên tắc nhất quán"
                ],
                correct: 1,
                explanation: "Vi phạm nguyên tắc phù hợp và cơ sở dồn tích vì tiền thuê nhà phục vụ cho 6 tháng nhưng lại dồn hết vào chi phí tháng 1."
            },
            {
                id: 20,
                question: "Если “Công ty Thùy Dương bị kiện đòi bồi thường 5 tỷ đồng, do tòa chưa ra công bố chính thức, không thể xác định chắc chắn số tiền phải bồi thường nên kế toán không khai báo thông tin này trên báo cáo tài chính” thì nguyên tắc kế toán bị vi phạm là:",
                options: [
                    "Nguyên tắc trọng yếu",
                    "Nguyên tắc giá gốc",
                    "Nguyên tắc hoạt động liên tục",
                    "Nguyên tắc nhất quán"
                ],
                correct: 0,
                explanation: "Khoản kiện tụng lớn có tính trọng yếu, nếu không trình bày dưới dạng thuyết minh sự kiện tiềm tàng là vi phạm nguyên tắc trọng yếu."
            },
            {
                id: 21,
                question: "Nếu “Công ty Nghĩa Phát ghi nhận doanh thu cho số tiền khách hàng ứng trước (hàng sẽ giao vào tháng sau)” thì nguyên tắc kế toán bị vi phạm là:",
                options: [
                    "Nguyên tắc hoạt động liên tục",
                    "Nguyên tắc cơ sở dồn tích",
                    "Nguyên tắc thận trọng",
                    "Nguyên tắc nhất quán."
                ],
                correct: 1,
                explanation: "Theo cơ sở dồn tích, tiền khách hàng ứng trước chưa giao hàng thì chưa được ghi nhận là doanh thu của kỳ này."
            },
            {
                id: 22,
                question: "Nếu “Trong quý 1 năm N, Công ty Sen Việt tính giá xuất kho hàng tồn kho theo phương pháp nhập trước – xuất trước. Sang quý 2 năm N, công ty chuyển sang tính giá xuất kho theo phương pháp bình quân gia quyền liên hoàn” thì nguyên tắc kế toán bị vi phạm là:",
                options: [
                    "Nguyên tắc giá gốc",
                    "Nguyên tắc phù hợp",
                    "Nguyên tắc nhất quán",
                    "Nguyên tắc thận trọng"
                ],
                correct: 2,
                explanation: "Nguyên tắc nhất quán yêu cầu phải áp dụng thống nhất các chính sách và phương pháp kế toán ít nhất trong một niên độ kế toán."
            },
            {
                id: 23,
                question: "Nếu Công ty TNHH Thuận Thành đang làm thủ tục phá sản, dự kiến sang đầu năm sau sẽ ngừng hoạt động thì nguyên tắc kế toán bị vi phạm là:",
                options: [
                    "Nguyên tắc giá gốc",
                    "Nguyên tắc phù hợp",
                    "Nguyên tắc hoạt động liên tục.",
                    "Nguyên tắc thận trọng"
                ],
                correct: 2,
                explanation: "Doanh nghiệp chuẩn bị phá sản/ngừng hoạt động thì giả định hoạt động liên tục không còn thỏa mãn, nếu vẫn áp dụng là vi phạm."
            },
            {
                id: 24,
                question: "Theo nguyên tắc cơ sở dồn tích, tài sản được ghi nhận vào sổ kế toán tại thời điểm doanh nghiệp:",
                options: [
                    "Ký hợp đồng mua tài sản.",
                    "Ứng trước tiền mua tài sản",
                    "Thanh toán hết nợ cho người bán.",
                    "Có quyền kiểm soát tài sản."
                ],
                correct: 3,
                explanation: "Tài sản được ghi nhận khi doanh nghiệp thực tế có quyền kiểm soát và mang lại lợi ích kinh tế trong tương lai."
            },
            {
                id: 25,
                question: "Theo nguyên tắc hoạt động liên tục, báo cáo tài chính được lập trên cơ sở:",
                options: [
                    "Đang hoạt động liên tục trong hiện tại.",
                    "Giả định hoạt động liên tục trong hiện tại và trong tương lai gần.",
                    "Chắc chắn hoạt động liên tục trong tương lai gần.",
                    "Đã hoạt động liên tục trong quá khứ."
                ],
                correct: 1,
                explanation: "Báo cáo tài chính phải được lập trên giả định doanh nghiệp đang tiếp tục hoạt động và sẽ tiếp tục hoạt động trong tương lai gần."
            },
            {
                id: 26,
                question: "Nguyên tắc thận trọng yêu cầu:",
                options: [
                    "Phải lập dự phòng khi vốn chủ sở hữu bị giảm giá trị.",
                    "Phải lập dự phòng khi nợ phải trả bị giảm giá trị.",
                    "Phải lập dự phòng khi tài sản bị giảm giá trị.",
                    "Tất cả các câu đều sai."
                ],
                correct: 2,
                explanation: "Nguyên tắc thận trọng yêu cầu không đánh giá cao hơn tài sản và thu nhập, không đánh giá thấp hơn nợ phải trả và chi phí, qua đó bắt buộc lập dự phòng khi tài sản bị giảm giá trị."
            },
            {
                id: 27,
                question: "Trong các phát biểu sau, phát biểu nào mô tả về yêu cầu đầy đủ được quy định trong VAS số 01 – Chuẩn mực chung:",
                options: [
                    "Các thông tin và số liệu kế toán trình bày trong báo cáo tài chính phải rõ ràng, dễ hiểu đối với người sử dụng.",
                    "Các thông tin và số liệu kế toán phải được ghi chép và báo cáo đúng với thực tế, không bị xuyên tạc, không bị bóp méo.",
                    "Mọi nghiệp vụ kinh tế, tài chính phát sinh liên quan đến kỳ kế toán phải được ghi chép và báo cáo đầy đủ, không bỏ sót.",
                    "Các thông tin và số liệu kế toán phải được ghi chép và báo cáo kịp thời, đúng hoặc trước thời hạn quy định, không được chậm trễ."
                ],
                correct: 2,
                explanation: "Yêu cầu 'đầy đủ' quy định mọi nghiệp vụ kinh tế tài chính phát sinh liên quan đến kỳ kế toán phải được ghi chép đầy đủ, không bỏ sót."
            },
            {
                id: 28,
                question: "Phát biểu nào sau đây mô tả đúng về môi trường kế toán?",
                options: [
                    "Môi trường kế toán bao gồm môi trường kinh tế, môi trường chính trị, môi trường xã hội và môi trường pháp lý.",
                    "Môi trường kế toán là môi trường pháp lý của hoạt động kế toán",
                    "a và b đúng",
                    "a và b sai"
                ],
                correct: 0,
                explanation: "Môi trường kế toán tổng hợp bao gồm toàn diện các yếu tố kinh tế, chính trị, xã hội và pháp lý chi phối hoạt động kế toán."
            },
            {
                id: 29,
                question: "Nếu “một nhà xưởng được mua với giá là 3 tỷ đồng, giá bán ước tính sẽ thu được là 5 tỷ đồng, trừ chi phí liên quan số tiền thuần thu được là 4,5 tỷ đồng” thì kế toán sẽ phản ánh nhà xưởng này trên báo cáo tài chính với giá trị là:",
                options: [
                    "3 tỷ đồng",
                    "5 tỷ đồng",
                    "4,5 tỷ đồng",
                    "4 tỷ đồng"
                ],
                correct: 0,
                explanation: "Theo nguyên tắc giá gốc, tài sản ghi nhận theo giá thực tế lúc mua là 3 tỷ đồng."
            },
            {
                id: 30,
                question: "Ngày 1/6, công ty bán chưa thu tiền một lô hàng. Ngày 10/6, sau khi khách hàng thanh toán hoàn bộ, công ty mới tiến hành hạch toán doanh thu vào sổ kế toán. Nguyên tắc kế toán bị vi phạm là:",
                options: [
                    "Thận trọng",
                    "Nhất quán",
                    "Phù hợp",
                    "Cơ sở dồn tích"
                ],
                correct: 3,
                explanation: "Theo cơ sở dồn tích, doanh thu phải được ghi nhận tại thời điểm giao hàng hoàn thành quyền sở hữu, không chờ đến khi nhận tiền."
            },
            {
                id: 31,
                question: "Kết quả của phương pháp Tổng hợp và cân đối kế toán biểu hiện dưới hình thức:",
                options: [
                    "Báo cáo tài chính",
                    "Báo cáo quản trị",
                    "Hệ thống các báo cáo kế toán",
                    "Tất cả đều sai"
                ],
                correct: 0,
                explanation: "Phương pháp tổng hợp và cân đối kế toán thể hiện kết quả qua hệ thống Báo cáo tài chính."
            },
            {
                id: 32,
                question: "Bản chất của phương pháp Tổng hợp và cân đối kế toán là",
                options: [
                    "Phản ánh tổng quát tình hình tài sản và nguồn vốn",
                    "Phản ánh tổng quát kết quả kinh doanh trong kỳ",
                    "Phản ánh tổng quát lưu lượng thu – chi và tồn của các luồng tiền hoạt động.",
                    "Tất cả đều đúng"
                ],
                correct: 3,
                    explanation: "Bản chất tổng hợp phản ánh toàn diện cả tài sản-nguồn vốn, kết quả kinh doanh và lưu chuyển tiền tệ."
            },
            {
                id: 33,
                question: "Biểu báo cáo nào sau đây không thuộc báo cáo tài chính",
                options: [
                    "Bảng cân đối số phát sinh và Tổng hợp chi tiết",
                    "Thuyết minh báo cáo tài chính và Lưu chuyển tiền tệ",
                    "Bảng cân đối kế toán",
                    "Báo cáo kết quả kinh doanh"
                ],
                correct: 0,
                explanation: "Bảng cân đối số phát sinh là bảng nghiệp vụ nội bộ, không nằm trong bộ Báo cáo tài chính chính thức theo luật định."
            },
            {
                id: 34,
                question: "Báo cáo tài chính cung cấp thông tin kế toán cho các đối tượng",
                options: [
                    "Bên trong doanh nghiệp",
                    "Bên ngoài doanh nghiệp",
                    "Bên trong doanh nghiệp và Bên ngoài doanh nghiệp",
                    "Chỉ báo cáo cho Thủ trưởng đơn vị, Thủ trưởng cấp trên và cơ quan Thuế"
                ],
                correct: 2,
                explanation: "Báo cáo tài chính phục vụ cho cả đối tượng bên trong (quản lý, hội đồng quản trị) lẫn bên ngoài (cổ đông, ngân hàng, cơ quan thuế, nhà đầu tư)."
            },
            {
                id: 35,
                question: "Cơ sở số liệu khi lập báo cáo tài chính chủ yếu từ:",
                options: [
                    "Bảng cân đối số phát sinh và Sổ Cái",
                    "Bảng cân đối số phát sinh và Bảng tổng hợp chi tiết",
                    "Bảng tổng hợp chi tiết và Sổ Cái",
                    "Bảng tổng hợp chi tiết và Bảng cân đối số phát sinh"
                ],
                correct: 2,
                explanation: "Số liệu lập BCTC chủ yếu được tổng hợp từ Bảng tổng hợp chi tiết và số liệu trên Sổ Cái các tài khoản."
            },
            {
                id: 36,
                question: "Bảng cân đối kế toán phản ánh tình hình:",
                options: [
                    "Doanh thu, chi phí và lợi nhuận trong một thời kỳ",
                    "Doanh thu, chi phí và lợi nhuận hai năm liên tục",
                    "Tài sản và nguồn vốn tại một thời điểm nhất định",
                    "Tài sản và nguồn vốn trong một thời kỳ"
                ],
                correct: 2,
                explanation: "Bảng cân đối kế toán là báo cáo tài chính tổng hợp phản ánh tình hình tài sản và nguồn vốn của doanh nghiệp tại một thời điểm nhất định."
            },
            {
                id: 37,
                question: "Phương trình cân đối nào sau đây không thuộc Bảng cân đối kế toán",
                options: [
                    "Tài sản ngắn hạn + tài sản dài hạn = Tổng nguồn vốn",
                    "Lợi nhuận = doanh thu – chi phí",
                    "Tổng tài sản = Nợ phải trả + vốn đầu tư chủ sở hữu",
                    "Tài sản ngắn hạn + tài sản dài hạn = Nợ phải trả + vốn đầu tư chủ sở hữu"
                ],
                correct: 1,
                explanation: "Phương trình 'Lợi nhuận = doanh thu - chi phí' thuộc về Báo cáo kết quả kinh doanh."
            },
            {
                id: 38,
                question: "Nghiệp vụ kinh tế nào sau đây không làm thay đổi tổng giá trị tài sản",
                options: [
                    "Mua tài sản cố định hữu hình bằng tiền gởi ngân hàng",
                    "Kiểm kê phát hiện thiếu một số vật liệu chưa rõ nguyên nhân",
                    "Thanh toán cho người bán bằng tiền vay ngắn hạn",
                    "Tất cả các câu đều đúng"
                ],
                correct: 3,
                explanation: "Cả ba nghiệp vụ trên đều làm thay đổi cơ cấu tài sản hoặc nợ mà không làm thay đổi tổng quy mô tài sản."
            },
            {
                id: 39,
                question: "Nghiệp vụ kinh tế nào sau đây sẽ làm thay đổi tổng giá trị tài sản",
                options: [
                    "Chủ sở hữu góp vốn bằng tài sản cố định hữu hình",
                    "Thu nợ người mua bằng tiền gởi ngân hàng",
                    "Bổ sung quỹ đầu tư phát triễn bằng lợi nhuận sau thuế chưa phân phối",
                    "Chia cổ tức từ lợi nhuận sau thuế chưa phân phối"
                ],
                correct: 0,
                explanation: "Góp vốn bằng TSCĐ làm tài sản tăng và nguồn vốn (vốn CSH) tăng, qua đó làm thay đổi tổng quy mô tài sản."
            },
            {
                id: 40,
                question: "Nghiệp vụ kinh tế nào sau đây thuộc mối quan hệ Tài sản tăng – Nguồn vốn tăng",
                options: [
                    "Kiểm kê phát hiện thiếu tài sản cố định hữu hình chưa rõ nguyên nhân",
                    "Kiểm kê phát hiện thừa tài sản cố định hữu hình chưa rõ nguyên nhân",
                    "Ứng trước tiền hàng cho người bán bằng tiền mặt",
                    "Thu lại tiền ứng trước cho người bán (do người bán không có hàng) tiền mặt"
                ],
                correct: 1,
                explanation: "Phát hiện thừa TSCĐ chưa rõ nguyên nhân ghi tăng tài sản (TK 211) đồng thời ghi tăng nguồn vốn/phải trả khác (chờ xử lý), thuộc quan hệ Tài sản tăng - Nguồn vốn tăng."
            },
            {
                id: 41,
                question: "Nghiệp vụ kinh tế nào sau đây thuộc mối quan hệ Tài sản giảm – Nguồn vốn giảm",
                options: [
                    "Kiểm kê phát hiện thiếu tài sản cố định hữu hình chưa rõ nguyên nhân",
                    "Kiểm kê phát hiện thừa tài sản cố định hữu hình chưa rõ nguyên nhân",
                    "Trả lại tài sản thừa cho chủ hàng sau khi xác định được nguyên nhân",
                    "Thu lại tiền bồi thường tài sản thiếu sau khi xác định được nguyên nhân"
                ],
                correct: 2,
                explanation: "Trả lại tài sản thừa cho chủ hàng làm tài sản giảm (giảm tiền/hàng thừa) và nguồn vốn/phải trả giảm xuống."
            },
            {
                id: 42,
                question: "Nghiệp vụ kinh tế nào sau đây làm thay đổi tỷ trọng các khoản mục (hoặc bên Tài sản, hoặc bên Nguồn vốn) của Bảng cân đối kế toán:",
                options: [
                    "Thu nợ người mua (khách hàng trả nợ) bằng tiền mặt và tiền gởi ngân hàng",
                    "Bổ sung quỹ đầu tư phát triển và vốn đầu tư chủ sở hữu từ lợi nhuận sau thuế",
                    "Mua hàng hóa bằng tiền mặt và tiền gởi ngân hàng",
                    "Mua công cụ, dụng cụ chưa thanh toán tiền."
                ],
                correct: 3,
                explanation: "Mua CCDC chưa trả tiền làm tăng tài sản (hàng tồn kho/CCDC) đồng thời làm tăng nợ phải trả, làm thay đổi tỷ trọng cấu trúc bảng cân đối."
            },
            {
                id: 43,
                question: "Nghiệp vụ kinh tế nào sau đây chỉ làm thay đổi tỷ trọng các khoản mục (hoặc bên Tài sản, hoặc bên Nguồn vốn) của Bảng cân đối kế toán:",
                options: [
                    "Tài sản tăng – tài sản giảm và tài sản tăng – nguồn vốn tăng",
                    "Tài sản giảm – nguồn vốn giảm và Tài sản tăng – tài sản giảm",
                    "Tài sản tăng – tài sản giảm và nguồn vốn tăng – nguồn vốn giảm",
                    "Tài sản giảm – nguồn vốn giảm và nguồn vốn tăng – nguồn vốn giảm"
                ],
                correct: 2,
                explanation: "Quan hệ Tài sản tăng - tài sản giảm (nằm hoàn toàn bên Tài sản) và Nguồn vốn tăng - nguồn vốn giảm (nằm hoàn toàn bên Nguồn vốn) chỉ làm thay đổi cơ cấu tỷ trọng nội bộ một bên."
            },
            {
                id: 44,
                question: "Số tiền lỗ từ hoạt động kinh doanh được phản ánh trên Bảng cân đối kế toán:",
                options: [
                    "Ghi số dương mục Phải thu khác",
                    "Ghi số dương mục Phải trả khác",
                    "Ghi số âm mục Quỹ khác của chủ sở hữu",
                    "Tất cả đều sai"
                ],
                correct: 3,
                explanation: "Số lỗ được phản ánh ghi âm dưới chỉ tiêu 'Lợi nhuận sau thuế chưa phân phối' thuộc phần Vốn chủ sở hữu, không phải các mục kia."
            },
            {
                id: 45,
                question: "Biểu báo cáo kết quả kinh doanh phản ánh tình hình:",
                options: [
                    "Doanh thu, chi phí và lợi nhuận trong một thời kỳ",
                    "Doanh thu, chi phí và lợi nhuận tại một thời điểm cuối năm",
                    "Tài sản, nguồn vốn và lợi nhuận tại một thời điểm cuối năm",
                    "Tài sản, nguồn vốn và lợi nhuận trong một thời kỳ"
                ],
                correct: 0,
                explanation: "Báo cáo kết quả kinh doanh phản ánh tình hình và kết quả hoạt động kinh doanh (doanh thu, chi phí, lợi nhuận) trong một thời kỳ."
            },
            {
                id: 46,
                question: "Phương trình cân đối nào sau đây thuộc Báo cáo kết quả kinh doanh",
                options: [
                    "Tài sản ngắn hạn + tài sản dài hạn = Tổng nguồn vốn",
                    "Lợi nhuận = doanh thu – chi phí",
                    "Tiền tồn đầu kỳ + thu trong kỳ = Tiền tồn cuối kỳ + chi trong kỳ",
                    "Tài sản ngắn hạn + tài sản dài hạn = Nợ phải trả + vốn đầu tư chủ sở hữu"
                ],
                correct: 1,
                explanation: "Phương trình xác định kết quả kinh doanh là Lợi nhuận = Doanh thu - Chi phí."
            },
            {
                id: 47,
                question: "Doanh thu thuần trên Báo cáo kết quả kinh doanh phản ánh",
                options: [
                    "Thu nhượng bán tài sản cố định",
                    "Thu nợ khách hàng (người mua thanh toán nợ)",
                    "Tổng giá bán hàng bán ra – các khoản làm giảm doanh thu",
                    "Tổng giá bán hàng bán ra – Tổng giá vốn hàng bán"
                ],
                correct: 2,
                explanation: "Doanh thu thuần = Tổng doanh thu bán hàng - các khoản giảm trừ doanh thu (chiết khấu thương mại, giảm giá hàng bán, hàng bán bị trả lại)."
            },
            {
                id: 48,
                question: "Lợi nhuận gộp (lãi gộp) trên Báo cáo kết quả kinh doanh phản ánh:",
                options: [
                    "Doanh thu thuần – giá vốn hàng bán",
                    "Doanh thu – chi phí kinh doanh",
                    "Tổng giá bán hàng bán ra – Tổng giá vốn hàng bán",
                    "Tất cả đều sai"
                ],
                correct: 0,
                explanation: "Lợi nhuận gộp = Doanh thu thuần - Giá vốn hàng bán."
            },
            {
                id: 49,
                question: "Lợi nhuận từ hoạt động tài chính là kết quả của đẳng thức:",
                options: [
                    "Lợi nhuận gộp – chi phí tài chính",
                    "Doanh thu tài chính – chi phí tài chính",
                    "Lãi tiền gởi ngân hàng – lãi tiền vay ngân hàng",
                    "Doanh thu cho thuê tài sản tài chính – chi phí cho thuê tài sản tài chính"
                ],
                correct: 1,
                explanation: "Lợi nhuận tài chính = Doanh thu tài chính - Chi phí tài chính."
            },
            {
                id: 50,
                question: "Lợi nhuận thuần từ hoạt động kinh doanh trên Báo cáo kết quả kinh doanh gồm:",
                options: [
                    "(Lợi nhuận gộp + lợi nhuận khác) – (chi phí bán hàng + chi phí quản lý doanh nghiệp)",
                    "(Lợi nhuận gộp + lợi nhuận khác) – (chi phí bán hàng + chi phí quản lý doanh nghiệp + chi phí khác)",
                    "(Lợi nhuận gộp + lợi nhuận tài chính) – (chi phí bán hàng + chi phí quản lý doanh nghiệp + chi phí khác)",
                    "(Lợi nhuận gộp + lợi nhuận tài chính) – (chi phí bán hàng + chi phí quản lý doanh nghiệp)"
                ],
                correct: 3,
                explanation: "LN thuần từ HĐKD = Lợi nhuận gộp + Doanh thu tài chính - Chi phí tài chính - Chi phí bán hàng - Chi phí quản lý doanh nghiệp (tức lấy gộp + tài chính trừ đi chi phí bán hàng & quản lý)."
            },
            {
                id: 51,
                question: "Đẳng thức lợi nhuận khác trên Báo cáo kết quả kinh doanh",
                options: [
                    "Lợi nhuận gộp – chi phí tài chính",
                    "Lợi nhuận gộp + lợi nhuận tài chính",
                    "Thu nhập khác – chi phí khác",
                    "Lợi nhuận thuần từ hoạt động kinh doanh – chi phí khác"
                ],
                correct: 2,
                explanation: "Lợi nhuận khác = Thu nhập khác - Chi phí khác."
            },
            {
                id: 52,
                question: "Đẳng thức Tổng lợi nhuận kế toán trước thuế trên Báo cáo kết quả kinh doanh",
                options: [
                    "Lợi nhuận thuần từ hoạt động kinh doanh + lợi nhuận khác",
                    "Lợi nhuận thuần từ hoạt động kinh doanh - lợi nhuận khác",
                    "Lợi nhuận thuần từ hoạt động kinh doanh + lợi nhuận gộp",
                    "Lợi nhuận thuần từ hoạt động kinh doanh - lợi nhuận gộp"
                ],
                correct: 0,
                explanation: "Tổng lợi nhuận trước thuế = Lợi nhuận thuần từ HĐKD + Lợi nhuận khác."
            },
            {
                id: 53,
                question: "Đẳng thức đúng nhất của lợi nhuận sau thuế chưa phân phối là",
                options: [
                    "Tổng lợi nhuận kế toán trước thuế + chi phí thuế thu nhập doanh nghiệp",
                    "Tổng lợi nhuận kế toán trước thuế - chi phí thuế thu nhập doanh nghiệp",
                    "Tổng lợi nhuận kế toán trước thuế - thuế giá trị gia tăng phải nộp",
                    "Tổng lợi nhuận kế toán trước thuế - thuế thu nhập doanh nghiệp bổ sung"
                ],
                correct: 1,
                explanation: "Lợi nhuận sau thuế = Tổng lợi nhuận trước thuế - Chi phí thuế TNDN hiện hành (và hoãn lại nếu có)."
            },
            {
                id: 54,
                question: "Cơ sở xác định chi phí thuế thu nhập hiện hành dựa trên:",
                options: [
                    "Lợi nhuận thuần từ hoạt động kinh doanh và thuế suất thuế thu nhập doanh nghiệp hiện hành",
                    "Lợi nhuận thuần từ hoạt động kinh doanh và thuế suất thuế giá trị gia tăng",
                    "Tổng lợi nhuận kế toán trước thuế và thuế suất thuế thu nhập doanh nghiệp hiện hành",
                    "Tổng lợi nhuận kế toán trước thuế và thuế suất thuế giá trị gia tăng"
                ],
                correct: 2,
                explanation: "Chi phí thuế TNDN hiện hành = Thu nhập tính thuế x Thuế suất thuế TNDN (được xác định trên cơ sở tổng lợi nhuận kế toán trước thuế sau khi điều chỉnh các khoản chênh lệch tạm thời/vĩnh viễn)."
            },
            {
                id: 55,
                question: "Biểu Lưu chuyển tiền tệ phản ánh tình hình:",
                options: [
                    "Doanh thu, chi phí và lợi nhuận trong một thời kỳ",
                    "Tài sản và nguồn vốn tại một thời điểm nhất định",
                    "Lưu lượng tiền thu vào và chi ra của các hoạt động kinh doanh, hoạt động đầu tư và hoạt động tài chính tại một thời điểm nhất định",
                    "Lưu lượng tiền thu vào và chi ra của các hoạt động kinh doanh, hoạt động đầu tư và hoạt động tài chính trong một thời kỳ"
                ],
                correct: 3,
                explanation: "Báo cáo lưu chuyển tiền tệ phản ánh luồng tiền thu và chi trong một thời kỳ theo 3 hoạt động: kinh doanh, đầu tư, tài chính."
            },
            {
                id: 56,
                question: "Phương trình cân đối nào sau đây thuộc Biểu Lưu chuyển tiền tệ",
                options: [
                    "Tài sản ngắn hạn + tài sản dài hạn = Tổng nguồn vốn",
                    "Lợi nhuận = doanh thu – chi phí",
                    "Tiền tồn đầu kỳ + thu trong kỳ = Tiền tồn cuối kỳ + chi trong kỳ",
                    "Tài sản ngắn hạn + tài sản dài hạn = Nợ phải trả + vốn đầu tư chủ sở hữu"
                ],
                correct: 2,
                explanation: "Phương trình cân đối tiền: Tiền tồn đầu kỳ + Tiền thu trong kỳ = Tiền chi trong kỳ + Tiền tồn cuối kỳ."
            },
            {
                id: 57,
                question: "Tài khoản kế toán là những trang sổ được dùng để:",
                options: [
                    "Phản ánh tình hình hiện có và biến động của tài sản",
                    "Phản ánh tình hình hiện có và biến động của nguồn vốn",
                    "Phản ánh tình hình hiện có và biến động của doanh thu, chi phí",
                    "Bao gồm các nội dung trên."
                ],
                correct: 3,
                explanation: "Tài khoản kế toán dùng để phản ánh hiện có và biến động của tất cả các đối tượng kế toán (tài sản, nguồn vốn, doanh thu, chi phí)."
            },
            {
                id: 58,
                question: "Tài khoản Tài sản có nguyên tắc ghi chép thông thường là:",
                options: [
                    "Dư bên Nợ, phát sinh tăng bên Nợ, phát sinh giảm bên có",
                    "Dư bên Nợ, phát sinh tăng bên Có, phát sinh giảm bên Nợ",
                    "Dư bên Có, phát sinh tăng bên Có, phát sinh giảm bên Nợ",
                    "Dư bên Có, phát sinh tăng bên Nợ, phát sinh giảm bên Có"
                ],
                correct: 0,
                explanation: "TK Tài sản có kết cấu: Dư Nợ đầu kỳ, tăng ghi Nợ, giảm ghi Có, Dư Nợ cuối kỳ."
            },
            {
                id: 59,
                question: "Tài khoản Nợ phải trả có nguyên tắc ghi chép thông thường là:",
                options: [
                    "Dư bên Nợ, phát sinh tăng bên Nợ, phát sinh giảm bên có",
                    "Dư bên Nợ, phát sinh tăng bên Có, phát sinh giảm bên Nợ",
                    "Dư bên Có, phát sinh tăng bên Có, phát sinh giảm bên Nợ",
                    "Dư bên Có, phát sinh tăng bên Nợ, phát sinh giảm bên Có"
                ],
                correct: 2,
                explanation: "TK Nợ phải trả có kết cấu ngược lại với tài sản: Dư Có, tăng ghi Có, giảm ghi Nợ."
            },
            {
                id: 60,
                question: "Tài khoản Vốn chủ sở hữu có nguyên tắc ghi chép thông thường là:",
                options: [
                    "Dư bên Nợ, phát sinh tăng bên Nợ, phát sinh giảm bên có",
                    "Dư bên Có, phát sinh tăng bên Có, phát sinh giảm bên Nợ",
                    "Không có số dư, phát sinh tăng bên Có, phát sinh giảm bên Nợ",
                    "Không có số dư, phát sinh tăng bên Nợ, phát sinh giảm bên Có"
                ],
                correct: 1,
                explanation: "TK Vốn chủ sở hữu có kết cấu tương tự nợ phải trả: Dư Có, tăng ghi Có, giảm ghi Nợ."
            },
            {
                id: 61,
                question: "Đối tượng kế toán nào sau đây chỉ có số dư ghi bên Nợ",
                options: [
                    "Người mua trả trước tiền",
                    "Doanh thu nhận trước",
                    "Ứng trước tiền cho người bán",
                    "Nhận ký quỹ, ký cược."
                ],
                correct: 2,
                explanation: "Ứng trước tiền cho người bán là khoản phải thu ngắn hạn (tài sản), chỉ có số dư bên Nợ."
            },
            {
                id: 62,
                question: "Đối tượng kế toán nào sau đây chỉ có số dư ghi bên Có",
                options: [
                    "Người mua trả trước tiền",
                    "Lợi nhuận chưa phân phối",
                    "Phải thu của khách hàng",
                    "Giá vốn hàng bán"
                ],
                correct: 0,
                explanation: "Khoản tiền người mua ứng trước phản ánh nghĩa vụ doanh nghiệp phải giao hàng hoặc cung cấp dịch vụ cho khách hàng trong tương lai (bản chất là một khoản Nợ phải trả thuộc Nguồn vốn).Do đó, chỉ tiêu/tài khoản này chỉ có số dư ghi bên Có."
            },
            {
                id: 63,
                question: "Tài khoản 214 “ Hao mòn TSCĐ” là tài khoản:",
                options: [
                    "Điều chỉnh giảm tài sản",
                    "Có số dư bên Có",
                    "Để bên phần tài sản và ghi số âm khi lên bảng cân đối tài khoản",
                    "a, b, c đều đúng"
                ],
                correct: 3,
                explanation: "TK 214 là tài khoản điều chỉnh giảm tài sản cố định, có số dư bên Có và được ghi số âm trên Bảng cân đối kế toán."
            },
            {
                id: 64,
                question: "Tài khoản nào sau đây là tài khoản doanh thu",
                options: [
                    "TK Doanh thu nhận trước",
                    "TK Doanh thu bán hàng",
                    "TK Giá vốn hàng bán",
                    "Cả a và b"
                ],
                correct: 1,
                explanation: "TK 511 (Doanh thu bán hàng và cung cấp dịch vụ) là tài khoản doanh thu thực tế, còn doanh thu nhận trước là nợ phải trả."
            },
            {
                id: 65,
                question: "Tài khoản 421 “Lợi nhuận sau thuế chưa phân phối” thuộc loại tài khoản:",
                options: [
                    "Tài sản",
                    "Nguồn vốn",
                    "Điều chỉnh tăng, giảm tài sản",
                    "Cả a, b đều đúng"
                ],
                correct: 1,
                explanation: "TK 421 thuộc loại tài khoản nguồn vốn (vốn chủ sở hữu)."
            },
            {
                id: 66,
                question: "Trong các tài khoản sau tài khoản nào chỉ có số dư bên Có:",
                options: [
                    "Tài sản cố định hữu hình",
                    "Chênh lệch tỷ giá hối đoái",
                    "Dự phòng tổn thất tài sản",
                    "Nguyên vật liệu."
                ],
                correct: 2,
                explanation: "Dự phòng tổn thất tài sản là tài khoản điều chỉnh giảm tài sản nên có kết cấu số dư bên Có."
            },
            {
                id: 67,
                question: "Nếu một tài khoản phản ánh tài sản cần có tài khoản điều chỉnh giảm, thì tài khoản điều chỉnh của nó phải có kết cấu:",
                options: [
                    "Ngược lại với tài khoản nó cần điều chỉnh.",
                    "Ghi tăng bên Có, ghi giảm bên Nợ, không có số dư.",
                    "Ghi tăng bên Có, ghi giảm bên Nợ, dư Có.",
                    "Cả a và c."
                ],
                correct: 3,
                explanation: "Tài khoản điều chỉnh giảm tài sản có kết cấu ngược lại (tăng Có, giảm Nợ, dư Có)."
            },
            {
                id: 68,
                question: "Thuế GTGT phải nộp thuộc:",
                options: [
                    "Nợ phải trả của doanh nghiệp.",
                    "Tài sản của doanh nghiệp.",
                    "Nguồn vốn của doanh nghiệp.",
                    "Cả a và c."
                ],
                correct: 3,
                explanation: "Thuế GTGT phải nộp là nghĩa vụ nợ phải trả, đồng thời xét về tổng thể nguồn vốn kinh doanh thì các khoản nợ phải trả nằm trong tổng nguồn vốn."
            },
            {
                id: 69,
                question: "Tổng phát sinh Nợ = Tổng phát sinh Có là do",
                options: [
                    "Quan hệ giữa tài khoản và nguồn vốn",
                    "Quan hệ giữa doanh thu và chi phí",
                    "Do tính chất của ghi sổ kép",
                    "Cả a và b"
                ],
                correct: 2,
                explanation: "Nguyên tắc ghi sổ kép luôn đảm bảo tổng số tiền ghi Nợ bằng tổng số tiền ghi Có cho mọi nghiệp vụ kinh tế."
            },
            {
                id: 70,
                question: "Tài khoản “Chi phí nguyên vật liệu trực tiếp” thuộc",
                options: [
                    "Tài khoản tập hợp - phân phối",
                    "Tài khoản thuộc Bảng cân đối kế toán",
                    "Tài khoản so sánh",
                    "Tài khoản tính giá thành"
                ],
                correct: 0,
                explanation: "TK 621 (Chi phí NVL trực tiếp) là tài khoản tập hợp chi phí và phân phối chi phí sản xuất."
            },
            {
                id: 71,
                question: "Số dư bên Có của TK 131 “Phải thu của khách hàng”",
                options: [
                    "Phản ánh khoản phải thu của khách hàng",
                    "Phản ánh khoản nhận ứng trước của khách hàng",
                    "Cả a và b đều đúng.",
                    "Cả a và b đều sai"
                ],
                correct: 1,
                explanation: "TK 131 là tài khoản lưỡng tính, nếu có số dư Có thì phản ánh khoản khách hàng trả trước tiền (ứng trước)."
            },
            {
                id: 72,
                question: "Số dư bên Nợ của TK 331 “Phải trả cho người bán”",
                options: [
                    "Phản ánh khoản phải trả cho người bán",
                    "Phản ánh khoản ứng trước cho người bán",
                    "Cả a và b đều đúng.",
                    "Cả a và b đều sai"
                ],
                correct: 1,
                explanation: "TK 331 là tài khoản lưỡng tính, số dư bên Nợ phản ánh số tiền doanh nghiệp đã ứng trước cho người bán."
            },
            {
                id: 73,
                question: "Tài khoản 131 “Phải thu của khách hàng” có số dư Có, khi lập bảng cân đối kế toán sẽ được ghi nhận:",
                options: [
                    "Bên Tài sản ghi Dương",
                    "Bên Tài sản ghi Âm",
                    "Bên Nguồn vốn thuộc phần Nợ phải trả ghi Dương",
                    "Bên Nguồn vốn thuộc phần Nợ phải trả ghi Âm"
                ],
                correct: 2,
                explanation: "Số dư Có của TK 131 bản chất là khoản người mua trả trước, khi lên BCTC được trình bày ở phần Nợ phải trả (dương)."
            },
            {
                id: 74,
                question: "Tài khoản 331 “Phải trả người bán” có số dư Nợ, khi lập bảng cân đối kế toán sẽ được ghi nhận:",
                options: [
                    "Bên Tài sản ghi Dương",
                    "Bên Tài sản ghi Âm",
                    "Bên Nguồn vốn thuộc phần Nợ phải trả ghi Dương",
                    "Bên Nguồn vốn thuộc phần Nợ phải trả ghi Âm"
                ],
                correct: 0,
                explanation: "Số dư Nợ của TK 331 bản chất là tiền ứng trước cho người bán, khi lên BCTC được trình bày ở phần Tài sản (dương)."
            },
            {
                id: 75,
                question: "Để định khoản các nghiệp vụ kinh tế phát sinh, kế toán cần căn cứ vào:",
                options: [
                    "Bảng cân đối kế toán",
                    "Sổ kế toán",
                    "Chứng từ kế toán",
                    "Tất cả các câu trên đều đúng"
                ],
                correct: 2,
                explanation: "Mọi định khoản kế toán đều phải dựa trên cơ sở pháp lý là chứng từ kế toán hợp lệ."
            },
            {
                id: 76,
                question: "Định khoản giản đơn là loại định khoản có liên quan đến",
                options: [
                    "Một tài khoản",
                    "Hai tài khoản",
                    "Nhiều tài khoản",
                    "Cả a, b, c đều sai"
                ],
                correct: 1,
                explanation: "Định khoản giản đơn chỉ liên quan đến đúng 2 tài khoản (1 Nợ, 1 Có)."
            },
            {
                id: 77,
                question: "Định khoản phức tạp là loại định khoản có liên quan đến",
                options: [
                    "Hai tài khoản trở lên",
                    "Từ Ba tài khoản trở lên.",
                    "Ba tài khoản",
                    "Cả a, b, c đều đúng"
                ],
                correct: 1,
                explanation: "Định khoản phức tạp là định khoản có liên quan từ 3 tài khoản trở lên (nhiều Nợ hoặc nhiều Có)."
            },
            {
                id: 78,
                question: "Bảng tổng hợp chi tiết tài khoản",
                options: [
                    "Dùng để tổng hợp số liệu các chứng từ gốc",
                    "Dùng để ghi chép chi tiết về sự biến động của tài sản",
                    "Dùng để ghi chép chi tiết về sự tăng giảm nguồn vốn",
                    "Dùng để kiểm tra, đối chiếu số liệu ghi chép của kế toán tổng hợp và kế toán chi tiết vào cuối kỳ"
                ],
                correct: 3,
                explanation: "Bảng tổng hợp chi tiết dùng để đối chiếu khớp đúng giữa số liệu kế toán chi tiết với kế toán tổng hợp cuối kỳ."
            },
            {
                id: 79,
                question: "Tài khoản 229 “Dự phòng tổn thất tài sản” là:",
                options: [
                    "Tài khoản tài sản",
                    "Tài khoản nguồn vốn",
                    "Tài khoản điều chỉnh giảm tài sản",
                    "Tài khoản điều chỉnh giảm nguồn vốn"
                ],
                correct: 2,
                explanation: "TK 229 là tài khoản điều chỉnh giảm cho các tài sản (chứng khoán, nợ phải thu khó đòi, hàng tồn kho...)."
            },
            {
                id: 80,
                question: "Số đầu tiên của số hiệu tài khoản thể hiện:",
                options: [
                    "Số thứ tự của tài khoản trong nhóm.",
                    "Loại tài khoản.",
                    "Nhóm tài khoản.",
                    "a và b đúng."
                ],
                correct: 1,
                explanation: "Chữ số đầu tiên trong hệ thống tài khoản Việt Nam thể hiện loại tài khoản (từ loại 1 đến loại 9)."
            },
            {
                id: 81,
                question: "Các tài khoản thuộc tài khoản trung gian là:",
                options: [
                    "Doanh thu, chi phí, tài sản, nợ phải trả.",
                    "Doanh thu, chi phí, xác định kết quả kinh doanh.",
                    "Tài sản, nợ phải trả, xác định kết quả kinh doanh.",
                    "Doanh thu, nguồn vốn, chi phí, tài sản."
                ],
                correct: 1,
                explanation: "Các tài khoản doanh thu, chi phí và xác định kết quả kinh doanh là nhóm tài khoản trung gian (cuối kỳ kết chuyển hết số dư về 0)."
            },
            {
                id: 82,
                question: "Các tài khoản được phân loại theo công dụng và kết cấu gồm",
                options: [
                    "Tài sản và nguồn vốn.",
                    "Tài sản, nguồn vốn, trung gian.",
                    "Tài sản, nguồn vốn, doanh thu và chi phí.",
                    "Chủ yếu, điều chỉnh và nghiệp vụ."
                ],
                correct: 3,
                explanation: "Theo công dụng và kết cấu, tài khoản chia thành: TK chủ yếu, TK điều chỉnh và TK nghiệp vụ."
            },
            {
                id: 83,
                question: "Các tài khoản được phân loại theo nội dung kinh tế gồm:",
                options: [
                    "Tài sản và nguồn vốn.",
                    "Tài sản, nguồn vốn, trung gian.",
                    "Tài sản, nguồn vốn, doanh thu và chi phí.",
                    "Chủ yếu, điều chỉnh và nghiệp vụ."
                ],
                correct: 1,
                explanation: "Theo nội dung kinh tế, tài khoản gồm các nhóm: Tài sản, Nguồn vốn và Trung gian"
            },
            {
                id: 84,
                question: "Tài khoản nào sau đây không phải là tài khoản trung gian:",
                options: [
                    "Chi phí quản lý doanh nghiệp.",
                    "Doanh thu bán hàng và cung cấp dịch vụ",
                    "Doanh thu chưa thực hiện",
                    "Xác định kết quả kinh doanh"
                ],
                correct: 2,
                explanation: "Doanh thu chưa thực hiện là tài khoản nợ phải trả (có số dư), không phải tài khoản trung gian."
            },
            {
                id: 85,
                question: "Vị trí thứ hai của số hiệu tài khoản thể hiện:",
                options: [
                    "Loại tài khoản.",
                    "Nhóm tài khoản.",
                    "Tài khoản cấp 1.",
                    "Tài khoản cấp 2."
                ],
                correct: 1,
                explanation: "Chữ số thứ hai trong ký hiệu tài khoản cấp 1 biểu thị nhóm tài khoản."
            },
            {
                id: 86,
                question: "Tài khoản nào sau đây không thuộc loại tài khoản điều chỉnh giảm:",
                options: [
                    "TK 511.",
                    "TK 214.",
                    "TK 229.",
                    "TK 521."
                ],
                correct: 0,
                explanation: "TK 511 là tài khoản doanh thu thực tế, không phải tài khoản điều chỉnh giảm."
            },
            {
                id: 87,
                question: "Doanh nghiệp kê khai và nộp thuế giá trị gia tăng (GTGT) theo phương pháp khấu trừ, khi mua nguyên vật liệu nhập kho thì giá trị ghi sổ của số nguyên vật liệu này là:",
                options: [
                    "Giá mua chưa thuế GTGT",
                    "Giá mua bao gồm thuế GTGT",
                    "Giá thanh toán",
                    "Giá vốn của bên bán"
                ],
                correct: 0,
                explanation: "Theo phương pháp khấu trừ, thuế GTGT đầu vào được khấu trừ riêng, nên giá gốc NVL nhập kho chỉ bao gồm giá mua chưa thuế."
            },
            {
                id: 88,
                question: "Nguyên giá TSCĐ chỉ thay đổi khi:",
                options: [
                    "Đánh giá lại theo quy định của cơ quan có thẩm quyền.",
                    "Trang bị thêm một số chi tiết bộ phận TSCĐ.",
                    "Đầu tư nâng cấp TSCĐ.",
                    "Các câu trên đều đúng."
                ],
                correct: 3,
                explanation: "Nguyên giá TSCĐ thay đổi trong các trường hợp nâng cấp, xây dựng lại hoặc đánh giá lại theo quyết định của nhà nước."
            },
            {
                id: 89,
                question: "Chiết khấu thương mại doanh nghiệp được hưởng khi mua hàng được ghi nhận:",
                options: [
                    "Giảm giá trị tài sản mua",
                    "Tăng doanh thu hoạt động tài chính",
                    "Không ảnh hưởng tới giá trị tài sản mua",
                    "Câu b và c đúng"
                ],
                correct: 0,
                explanation: "Chiết khấu thương mại được hưởng khi mua hàng làm giảm trực tiếp giá trị thực tế của tài sản mua vào."
            },
            {
                id: 90,
                question: "Giá trị thuần có thể thực hiện được của hàng tồn kho là:",
                options: [
                    "Giá bán hàng tồn kho trừ (-) Giá mua của chúng.",
                    "Giá mua hàng tồn kho và các chi phí liên quan trực tiếp khác phát sinh để có được hàng tồn kho ở địa điểm và trạng thái hiện tại.",
                    "Giảm giá hàng tồn kho",
                    "Giá bán ước tính của hàng tồn kho - Chi phí ước tính để tiêu thụ chúng."
                ],
                correct: 3,
                explanation: "GT thuần có thể thực hiện được = Giá bán ước tính - Chi phí ước tính để hoàn thành - Chi phí ước tính tiêu thụ."
            },
            {
                id: 91,
                question: "Chiết khấu thanh toán được hưởng khi mua hàng được ghi:",
                options: [
                    "Tăng giá trị tài sản mua",
                    "Tăng doanh thu hoạt động tài chính và Không ảnh hưởng giá trị tài sản mua",
                    "Không ảnh hưởng giá trị tài sản mua.",
                    "Câu b và c đúng."
                ],
                correct: 3,
                explanation: "Chiết khấu thanh toán được hưởng do thanh toán sớm được hạch toán vào doanh thu tài chính (hoặc tài chính giảm chi phí), không làm thay đổi giá gốc hàng mua."
            },
            {
                id: 92,
                question: "Doanh nghiệp kê khai và tính thuế GTGT theo phương pháp khấu trừ, mua 50 máy tính để bán, giá mua 5.000.000 đồng/cái, thuế GTGT 10%, giá bán ước tính 6.500.000 đồng/cái, thuế GTGT 10%. Chiết khấu thương mại được hưởng 2%. Giá thực tế của lô máy tính này là:",
                options: [
                    "250.000.000 đồng",
                    "325.000.000 đồng",
                    "245.000.000 đồng",
                    "318.500.000 đồng"
                ],
                correct: 2,
                explanation: "Giá mua chưa thuế = 50 x 5.000.000 = 250 triệu. Trừ chiết khấu thương mại 2% (250tr x 2% = 5tr) => Giá thực tế = 245 triệu đồng."
            },
            {
                id: 93,
                question: "Doanh nghiệp kê khai và tính thuế GTGT theo phương pháp trực tiếp, nhập khẩu một lô vật liệu với giá nhập khẩu là 200.000.000 đồng, thuế suất thuế nhập khẩu 10%, thuế suất thuế GTGT 10%, Chi phí bốc xếp, vận chuyển lô vật liệu trên về kho (đã bao gồm thuế GTGT 10%) là 4.950.000. Giá thực tế nhập kho của lô vật liệu trên là:",
                options: [
                    "224.500.000 đồng",
                    "246.500.000 đồng",
                    "244.500.000 đồng",
                    "Các câu trên đều sai"
                ],
                correct: 3,
                explanation: "Giá nhập khẩu: 200.000.000 đồng; Thuế nhập khẩu: 200.000.000 x 10%=20.000.000 đồng; Thuế GTGT=(200.000.000+20.000.000) x 10%=22.000.000 đồng; CPVC (đã GTGT)=4.950.000 đồng. Suy ra, NGUYÊN GIÁ=200.000.000+20.000.000+22.000.000+4.950.000=246.950.000. Tất cả đáp án trên đều sai"
            },
            {
                id: 94,
                question: "Doanh nghiệp kê khai và tính thuế GTGT theo phương pháp khấu trừ, nhập khẩu một lô vật liệu với giá nhập khẩu 500.000.000 đồng, thuế suất thuế nhập khẩu 10%, thuế suất thuế GTGT 0%,. Chi phí bốc xếp, vận chuyển lô vật liệu trên về kho (đã bao gồm thuế GTGT 10%) là 5.720.000. Trị giá nhập kho của lô vật liệu trên là:",
                options: [
                    "500.000.000 đồng",
                    "610.200.000 đồng",
                    "555.500.000 đồng",
                    "Các câu trên đều sai"
                ],
                correct: 3,
                explanation: "Giá NK 500.000.000; Thuế NK=500.000.000 x 10%=50.000.000; CPVC=5.720.000/1.1=5.200.000; => Nguyên Giá = 500.000.000+50.000.000+5.200.000=555.200.000 đồng, do đó các phương án a, b, c đều sai."
            },
            {
                id: 95,
                question: "Doanh nghiệp tính thuế GTGT theo phương pháp trực tiếp, nhập khẩu một lô nguyên vật liệu, số lượng 2.000 kg VL, đơn giá nhập khẩu 100.000 đ/kg. thuế nhập khẩu 10%, thuế GTGT 10%. Chi phí vận chuyển gồm thuế GTGT 10% là 9.900.000 đ. Giá thực tế vật liệu nhập kho, và đơn giá nhập kho lần lượt là:",
                options: [
                    "231.900.000 đồng và 115.950 đồng/kg.",
                    "229.900.000 đồng và 114.950 đồng/kg.",
                    "251.900.000 đồng và 125.950 đồng/kg.",
                    "Tất cả các câu đều sai."
                ],
                correct: 2,
                explanation: "Tính toán chi tiết theo phương pháp trực tiếp: Trị giá = 200tr (giá) + 20tr (thuế NK) + 20tr (thuế GTGT hàng NK) + 9.9tr (chi phí vận chuyển gồm thuế) = 251.900.000đ; đơn giá = 251.900.000 / 2000 = 125.950 đ/kg."
            },
            {
                id: 96,
                question: "Doanh nghiệp kê khai và tính thuế GTGT theo phương pháp trực tiếp, mua 5.000m vải dùng để cho sản xuất áo sơ mi, giá mua chưa thuế 30.000đ/m, thuế GTGT 10%. Do hàng giao bị lỗi nên doanh nghiệp quyết định trả lại cho người bán 500m vải. Chi phí vận chuyển vật liệu (bao gồm 10% thuế GTGT): 1.650.000đ. Giá thực tế nhập kho và đơn giá nhập kho của vật liệu lần lượt là:",
                options: [
                    "150.000.000 đồng và 33.333 đồng/m",
                    "150.150.000 đồng và 33.367 đồng/m",
                    "136.500.000 và 30.333 đồng/m",
                    "Các câu trên đều sai"
                ],
                correct: 1,
                explanation: "Tính toán theo phương pháp trực tiếp (giá thanh toán gồm cả thuế): Trị giá thực tế nhập kho = (4500m x 30.000 x 1.1) + 1.650.000 = 150.150.000đ; đơn giá = 150.150.000 / 4500 = 33.367 đ/m."
            },
            {
                id: 97,
                question: "Trong thời gian giá cả hàng hóa ngoài thị trường đang biến động giảm, phương pháp tính giá hàng tồn kho nào cho giá trị hàng tồn kho cuối kỳ thấp nhất.",
                options: [
                    "Nhập trước, xuất trước",
                    "Bình quân gia quyền cuối kỳ",
                    "Bình quân gia quyền di động",
                    "Các câu trên đều sai"
                ],
                correct: 0,
                explanation: "Khi giá giảm, phương pháp FIFO (Nhập trước xuất trước) lấy giá mua đắt đầu kỳ đi xuất trước, còn tồn kho cuối kỳ là giá mua rẻ mới nhất -> cho giá trị tồn kho cuối kỳ thấp nhất."
            },
            {
                id: 98,
                question: "Trong giai đoạn lạm phát, giá cả hàng hóa ngoài thị trường biến động tăng, phương pháp nào cho ra kết quả lợi nhuận cao nhất:",
                options: [
                    "Thực tế đích danh",
                    "Nhập trước, xuất trước",
                    "Bình quân gia quyền",
                    "Các câu trên đều sai"
                ],
                correct: 1,
                explanation: "Trong giai đoạn lạm phát (giá tăng), FIFO xuất kho với giá cũ thấp nhất, dẫn đến giá vốn thấp nhất và lợi nhuận cao nhất."
            },
            {
                id: 99,
                question: "Thuế bảo vệ môi trường phải nộp được ghi:",
                options: [
                    "Tăng chi phí quản lý doanh nghiệp",
                    "Tăng giá trị tài sản mua vào",
                    "Giảm giá trị tài sản mua vào",
                    "Các câu trên đều sai"
                ],
                correct: 1,
                explanation: "Thuế bảo vệ môi trường đối với hàng mua vào thuộc loại thuế gián thu không được hoàn lại, tính vào nguyên giá tài sản mua vào."
            },
            {
                id: 100,
                question: "Doanh nghiệp kê khai và tính thuế GTGT theo phương pháp khấu trừ, mua 5.000kg vật liệu, giá mua chưa thuế 25.000đ/kg, thuế GTGT 10%, do thanh toán trước hạn nên được hưởng chiết khấu thanh toán: 3.000.000đ. Chi phí vận chuyển vật liệu về kho (bao gồm thuế GTGT 10%): 2.310.000đ. Giá thực tế nhập kho vật liệu là:",
                options: [
                    "124.100.000 đồng",
                    "127.100.000 đồng",
                    "124.310.000 đồng",
                    "Các câu trên đều sai"
                ],
                correct: 1,
                explanation: "Giá mua chưa thuế = 5000 x 25.000 = 125 triệu. Chi phí vận chuyển chưa thuế = 2.310.000 / 1.1 = 2.100.000đ. Chiết khấu thanh toán không làm giảm giá trị hàng mua. Trị giá = 125tr + 2.1tr = 127.100.000 đồng."
            },
            {
                id: 101,
                question: "Doanh nghiệp kê khai thường xuyên, có tài liệu liên quan đến vật liệu:\n-Tồn đầu tháng: 2.000kg (Giá 25.000đ/kg);\n-Nhập lần 1 (3000 kg - 25.400đ/kg, chi phí vận chuyển 200 đ/kg);\n-Xuất lần 1(4000 kg);\n-Nhập lần 2 ( 5.000kg - 25.200đ/kg, chi phí vận chuyển 400 đ/kg, được giảm giá 100đ/kg);\n-Xuất lần 2: 2.000kg.\nTrị giá vật liệu xuất kho trong tháng theo phương pháp bình quân gia quyền cuối kỳ:",
                options: [
                    "152.580.000 đồng",
                    "151.020.000 đồng",
                    "151.900.000 đồng",
                    "Tất cả các câu đều sai."
                ],
                correct: 0,
                explanation: "TGiá BQGQ = (2000*25.000)+(3000*25.600)+(5000*25.500)/(2000+3000+5000)=25.430đ/kg. Giá trị kho = 25.430*(4000+2000)= 152.580.000 đồng."
            },
            {
                id: 102,
                question:"Doanh nghiệp kê khai thường xuyên, có tài liệu liên quan đến vật liệu:\n-Tồn đầu tháng: 2.000kg  (giá 20.000 đ/kg);\n-Nhập lần 1: 3.000kg (Giá 22.000đ/kg, chi phí vận chuyển 500 đ/kg.);\n-Xuất lần 1: 4.000kg;\n-Nhập lần 2: 5.000kg (Giá 22.500đ/kg, chi phí vận chuyển 400 đ/kg, được giảm giá 100đ/kg.);\n-Xuất lần 2: 2.000kg.;\nTrị giá vật liệu xuất kho theo phương pháp nhập trước - xuất trước lần lượt là:",
                options: [
                    "85.000.000 đồng và 45.300.000 đồng",
                    "84.000.000 đồng và 44.400.000 đồng",
                    "80.000.000 đồng và 44.000.000 đồng",
                    "Các câu trên đều sai"
                ],
                correct: 0,
                explanation: "Lần 1 = (2000*20.000)+(2000*22.500)=85.000.000;lần 2 = (1000*22.500)+(1000*22.800)=45.300.000;Trị giá xuất kho lần 1 và lần 2 lần lượt là 85.000.000 đồng và 45.300.000 đồng."
            },
            {
                id: 103,
                question: "Doanh nghiệp kê khai thường xuyên, có tài liệu liên quan đến vật liệu: \n-Tồn đầu tháng: 2.000kg  (Giá 20.000 đ/kg);\n-Nhập lần 1: 3.000kg  (Giá 22.000đ/kg, chi phí vận chuyển 500 đ/kg.;\n-Xuất lần 1: 4.000kg.;\n-Nhập lần 2: 5.000kg (Giá 22.500đ/kg, chi phí vận chuyển 400 đ/kg, được giảm giá 100đ/kg.);\n-Xuất lần 2: 2.000kg.;\nTrị giá vật liệu xuất kho theo phương pháp thực tế đích danh, cho biết:\n+ Xuất lần 1: 1.500 kg thuộc tồn đầu kỳ, số còn lại thuộc nhập lần 1;\n+ Xuất lần 2: 500 kg thuộc tồn đầu kỳ, 500 kg thuộc nhập lần 1, số còn lại thuộc lô nhập lần 2",
                options: [
                    "85.000.000 đồng và 43.400.000 đồng",
                    "84.000.000 đồng và 44.400.000 đồng",
                    "86.250.000 đồng và 44.050.000 đồng",
                    "Các câu trên đều sai"
                ],
                correct: 2,
                explanation: "Lần 1 = (1500*20.000)+(2500*22.500)= là 86.250.000 đồng; Lần 2 = (500*20.000)+(500*22.500)+(1000*22.800)=44.050.000 đồng."
            },
            {
                id: 104,
                question: "Công ty XYZ cấp một TSCĐ cho công ty con A. Nguyên giá trên sổ XYZ là 570.000.000đ, giá trị hao mòn lũy kế: 120.000.000đ. Công ty A sẽ ghi nhận nguyên giá của TSCĐ này là:",
                options: [
                    "620.000.000",
                    "570.000.000",
                    "500.000.000",
                    "450.000.000"
                ],
                correct: 3,
                explanation: "Khi cấp phát nội bộ TSCĐ đã qua sử dụng, công ty nhận ghi nhận theo giá trị còn lại trên sổ sách của đơn vị cấp: 570.000.000 - 120.000.000 = 450.000.000 đồng."
            },
            {
                id: 105,
                question: "Doanh nghiệp mua 10.000kg vật liệu với giá mua chưa thuế 15.000đ/kg, thuế GTGT 10%, được giảm giá 500 đ/kg (chưa thuế GTGT). Chi phí vận chuyển chi hộ người bán gồm thuế GTGT 10%: 1.100.000đ. Trị giá nhập kho lô vật liệu theo phương pháp khấu trừ là:",
                options: [
                    "145.000.000",
                    "146.000.000",
                    "146.100.000",
                    "Tất cả các câu đều sai."
                ],
                correct: 0,
                explanation: "Giá mua chưa thuế = 10.000 x (15.000 - 500) = 145.000.000đ. Chi phí vận chuyển chi hộ người bán tính vào khoản khác hoặc không tính vào giá gốc NVL mua tùy trường hợp, kết quả tính giá gốc đúng là 145.000.000 đồng."
            },
            {
                id: 106,
                question: "Phát biểu nào sau đây đúng về vai trò của kế toán quản trị trong doanh nghiệp?",
                options: [
                    "Cung cấp thông tin chi tiết phục vụ cho việc lập kế hoạch, ra quyết định và kiểm soát nội bộ.",
                    "Chỉ cung cấp thông tin cho cơ quan thuế và cơ quan nhà nước.",
                    "Chỉ lập báo cáo tài chính định kỳ theo quy định pháp luật.",
                    "Tất cả các câu trên đều đúng."
                ],
                correct: 0,
                explanation: "Kế toán quản trị phục vụ chủ yếu cho người quản trị bên trong nhằm lập kế hoạch, ra quyết định và kiểm soát."
            },
            {
                id: 107,
                question: "Trong phương pháp ghi sổ kép, mối quan hệ đối ứng tài khoản phản ánh:",
                options: [
                    "Sự vận động kinh tế khách quan giữa các đối tượng kế toán có liên quan với nhau trong mỗi nghiệp vụ.",
                    "Tổng số tiền ghi bên Nợ luôn nhỏ hơn bên Có.",
                    "Sự độc lập hoàn toàn giữa các tài khoản.",
                    "Tất cả đều sai."
                ],
                correct: 0,
                explanation: "Đối ứng tài khoản phản ánh mối quan hệ vận động khách quan giữa các đối tượng kế toán khi có nghiệp vụ phát sinh."
            },
            {
                id: 108,
                question: " Chi phí khấu hao tài sản cố định phục vụ kinh doanh trong kỳ nằm trong khoản mục nào của Biểu Lưu chuyển tiền tệ?",
                options: [
                    "Luồng tiền thu vào từ hoạt động kinh doanh",
                    "Luồng tiền chi ra từ hoạt động kinh doanh",
                    "Luồng tiền chi ra từ hoạt động đầu tư",
                    "Luồng tiền chi ra từ hoạt động tài chính"
                ],
                correct: 0,
                explanation: "Đối ứng tài khoản phản ánh mối quan hệ vận động khách quan giữa các đối tượng kế toán khi có nghiệp vụ phát sinh."
            }
];
