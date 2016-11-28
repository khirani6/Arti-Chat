//
//  ChatDetailVCViewController.swift
//  Arti-Chat
//
//  Created by Neeraj Joshua DeLima on 11/27/16.
//  Copyright © 2016 Team Rick. All rights reserved.
//

import UIKit
import QuartzCore

class ChatDetailVC: UIViewController {
    // Buttons
    @IBOutlet weak var sendButton: UIButton!
    
    @IBOutlet weak var firstChatLabel: UILabel!

    @IBOutlet weak var messageTextBox: UITextField!
    
    var lastY = 245
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */
    
    // MARK: Actions
    func UIColorFromRGB(rgbValue: UInt) -> UIColor {
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(1.0)
        )
    }
    
    @IBAction func sendMessage(_ sender: UIButton) {
    
        
        let label = UILabel(frame: CGRect(x: 0, y: 0, width: 120, height: 80))
        
        label.center = CGPoint(x: 250, y: lastY)
        label.textAlignment = .right
        label.text = messageTextBox.text
        label.numberOfLines = 3
        label.font = UIFont(name: "Avenir", size: 12)
        label.backgroundColor = UIColorFromRGB(rgbValue: 0x4c66a4)
        label.textColor = UIColor.white
        label.layer.masksToBounds = true
        label.layer.cornerRadius = 5
        
        lastY = lastY + 100
        if (messageTextBox.text != "") {
            self.view.addSubview(label)
        }
        messageTextBox.text = ""
    }

}
