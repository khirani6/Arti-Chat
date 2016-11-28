//
//  SettingVC.swift
//  Arti-Chat
//
//  Created by Komal Hirani on 11/27/16.
//  Copyright © 2016 Team Rick. All rights reserved.
//

import UIKit
import Foundation

class SettingVC: UIViewController {

    //@IBOutlet weak var navigationItem: UINavigationItem!
    @IBOutlet weak var imageView: UIImageView!
    let userDef = UserDefaults.standard
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //self.navigationItem.title = "Title"
        self.navigationItem.title = userDef.string(forKey: "nameToPass")
        imageView.image = UIImage(named: userDef.string(forKey: "imageToPass")!)

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

}
